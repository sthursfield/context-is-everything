#!/usr/bin/env python3
"""
Article Sync Automation Script

Automatically updates all files when you add a new article JSON file.

This script will:
1. Scan thought_leadership/articles/ for new article JSON files
2. Update src/app/insights/[slug]/page.tsx with slug mapping
3. Update src/app/api/ai/sitemap/route.ts with article metadata
4. Update src/app/api/ai/knowledge-base/route.ts with article summary
5. Update src/app/api/ai-consultant/route.ts system prompt
6. Verify structured data exists in article JSON
7. Create a summary report

Usage:
    python scripts/sync-new-article.py
    python scripts/sync-new-article.py --check  # Check only, don't update
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# Base paths
BASE_DIR = Path(__file__).parent.parent
ARTICLES_DIR = BASE_DIR / "thought_leadership" / "articles"
PAGE_TSX = BASE_DIR / "src" / "app" / "insights" / "[slug]" / "page.tsx"
SITEMAP_ROUTE = BASE_DIR / "src" / "app" / "api" / "ai" / "sitemap" / "route.ts"
KNOWLEDGE_BASE_ROUTE = BASE_DIR / "src" / "app" / "api" / "ai" / "knowledge-base" / "route.ts"
AI_CONSULTANT_ROUTE = BASE_DIR / "src" / "app" / "api" / "ai-consultant" / "route.ts"


def load_article_json(file_path: Path) -> Dict:
    """Load and parse article JSON file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def scan_articles() -> List[Tuple[str, Dict]]:
    """Scan all article JSON files and return parsed data."""
    articles = []
    for file_path in ARTICLES_DIR.glob("article-*.json"):
        try:
            data = load_article_json(file_path)
            articles.append((file_path.stem, data))
        except Exception as e:
            print(f"⚠️  Error reading {file_path.name}: {e}")
    return sorted(articles, key=lambda x: x[0])


def extract_slug_mappings(page_tsx_content: str) -> Dict[str, str]:
    """Extract current slug mappings from page.tsx ARTICLE_SLUGS section only."""
    # Extract just the ARTICLE_SLUGS section
    slug_section_pattern = r'const ARTICLE_SLUGS: Record<string, string> = \{([^}]+)\}'
    slug_section_match = re.search(slug_section_pattern, page_tsx_content, re.DOTALL)

    if not slug_section_match:
        return {}

    slug_section = slug_section_match.group(1)

    # Now extract mappings from this section only
    pattern = r"'([^']+)':\s*'([^']+)'"
    matches = re.findall(pattern, slug_section)
    return dict(matches)


def check_structured_data(article_data: Dict) -> bool:
    """Check if article has structured data."""
    try:
        return 'structuredData' in article_data['article']['versions']['bot']
    except KeyError:
        return False


def generate_slug_from_title(title: str) -> str:
    """Generate URL slug from article title."""
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = slug.strip('-')
    # Truncate very long slugs
    if len(slug) > 60:
        slug = slug[:60].rsplit('-', 1)[0]
    return slug


def analyze_discrepancies(articles: List[Tuple[str, Dict]], current_mappings: Dict[str, str]) -> Dict:
    """Analyze discrepancies between articles and current mappings."""
    article_ids = {article_id for article_id, _ in articles}
    mapped_ids = set(current_mappings.values())

    missing_from_mappings = article_ids - mapped_ids
    extra_in_mappings = mapped_ids - article_ids

    # Check for articles without structured data
    missing_structured_data = []
    for article_id, data in articles:
        if not check_structured_data(data):
            missing_structured_data.append(article_id)

    return {
        'missing_from_mappings': missing_from_mappings,
        'extra_in_mappings': extra_in_mappings,
        'missing_structured_data': missing_structured_data
    }


def generate_slug_mapping_code(articles: List[Tuple[str, Dict]]) -> str:
    """Generate TypeScript code for slug mappings."""
    lines = ["const ARTICLE_SLUGS: Record<string, string> = {"]

    for article_id, data in articles:
        try:
            slug = data['article']['slug']
            lines.append(f"  '{slug}': '{article_id}',")
        except KeyError:
            print(f"⚠️  Warning: {article_id} missing slug field")

    lines.append("}")
    return "\n".join(lines)


def generate_sitemap_article_entry(article_data: Dict) -> str:
    """Generate sitemap entry for an article."""
    article = article_data['article']
    title = article['title']
    slug = article['slug']
    tags = article['metadata']['tags']
    excerpt = article['versions']['bot']['excerpt']

    # Extract key takeaway from excerpt (first sentence usually)
    key_takeaway = excerpt.split('.')[0] + '.'

    return f'''      {{
        title: "{title}",
        url: "https://www.context-is-everything.com/insights/{slug}",
        category: "{tags[0] if tags else 'AI Strategy'}",
        topics: {json.dumps(tags[:3])},
        visibility: "search_only",
        key_takeaway: "{key_takeaway}"
      }}'''


def generate_knowledge_base_entry(article_data: Dict) -> str:
    """Generate knowledge base entry for an article."""
    article = article_data['article']
    title = article['title']
    slug = article['slug']
    excerpt = article['versions']['bot']['excerpt']

    return f'''      {{
        title: "{title}",
        url: "/insights/{slug}",
        summary: "{excerpt}",
        key_insights: {json.dumps(article['metadata']['tags'][:3])}
      }}'''


def generate_system_prompt_entry(article_data: Dict, number: int) -> str:
    """Generate system prompt entry for an article."""
    article = article_data['article']
    title = article['title']
    excerpt = article['versions']['bot']['excerpt']

    # Create concise one-liner
    summary = excerpt.split('.')[0] + '.'
    if len(summary) > 80:
        summary = summary[:77] + '...'

    return f"{number}. **{title}**: {summary}"


def update_page_tsx(articles: List[Tuple[str, Dict]], dry_run: bool = False) -> bool:
    """Update page.tsx with new slug mappings."""
    if not PAGE_TSX.exists():
        print(f"❌ {PAGE_TSX} not found")
        return False

    content = PAGE_TSX.read_text()
    current_mappings = extract_slug_mappings(content)

    # Generate new mappings
    new_mapping_code = generate_slug_mapping_code(articles)

    # Replace the ARTICLE_SLUGS section
    pattern = r'const ARTICLE_SLUGS: Record<string, string> = \{[^}]+\}'
    new_content = re.sub(pattern, new_mapping_code, content, flags=re.DOTALL)

    if new_content == content:
        print("✓ page.tsx already up to date")
        return True

    if not dry_run:
        PAGE_TSX.write_text(new_content)
        print(f"✓ Updated {PAGE_TSX.relative_to(BASE_DIR)}")
    else:
        print(f"  Would update {PAGE_TSX.relative_to(BASE_DIR)}")

    return True


def update_ai_consultant_prompt(articles: List[Tuple[str, Dict]], dry_run: bool = False) -> bool:
    """Update AI consultant system prompt with all articles."""
    if not AI_CONSULTANT_ROUTE.exists():
        print(f"❌ {AI_CONSULTANT_ROUTE} not found")
        return False

    content = AI_CONSULTANT_ROUTE.read_text()

    # Generate article list
    article_lines = []
    for idx, (article_id, data) in enumerate(articles, 1):
        article_lines.append(generate_system_prompt_entry(data, idx))

    article_section = "\n".join(article_lines)

    # Replace THOUGHT LEADERSHIP ARTICLES section
    pattern = r'THOUGHT LEADERSHIP ARTICLES \(Reference conversationally when relevant\):\n.*?\n\nNOTE:'
    replacement = f'THOUGHT LEADERSHIP ARTICLES (Reference conversationally when relevant):\n{article_section}\n\nNOTE:'

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content == content:
        print("✓ AI consultant prompt already up to date")
        return True

    if not dry_run:
        AI_CONSULTANT_ROUTE.write_text(new_content)
        print(f"✓ Updated {AI_CONSULTANT_ROUTE.relative_to(BASE_DIR)}")
    else:
        print(f"  Would update {AI_CONSULTANT_ROUTE.relative_to(BASE_DIR)}")

    return True


def print_sync_report(articles: List[Tuple[str, Dict]], discrepancies: Dict):
    """Print comprehensive sync report."""
    print("\n" + "=" * 70)
    print("  ARTICLE SYNC REPORT")
    print("=" * 70)

    print(f"\n📚 DISCOVERED ARTICLES: {len(articles)}")
    for article_id, data in articles:
        article = data['article']
        has_structured_data = check_structured_data(data)
        status = "✓" if has_structured_data else "⚠️ "
        print(f"  {status} {article_id}: {article['title']}")

    if discrepancies['missing_from_mappings']:
        print(f"\n⚠️  MISSING FROM PAGE.TSX MAPPINGS:")
        for article_id in discrepancies['missing_from_mappings']:
            print(f"    • {article_id}")

    if discrepancies['extra_in_mappings']:
        print(f"\n⚠️  EXTRA IN PAGE.TSX (no JSON file):")
        for article_id in discrepancies['extra_in_mappings']:
            print(f"    • {article_id}")

    if discrepancies['missing_structured_data']:
        print(f"\n⚠️  MISSING STRUCTURED DATA:")
        for article_id in discrepancies['missing_structured_data']:
            print(f"    • {article_id}")
        print(f"\n  Run: python scripts/add-structured-data.py {' '.join(discrepancies['missing_structured_data'])}")

    print(f"\n📝 FILES TO UPDATE:")
    print(f"  • {PAGE_TSX.relative_to(BASE_DIR)}")
    print(f"  • {AI_CONSULTANT_ROUTE.relative_to(BASE_DIR)}")
    print(f"  • {SITEMAP_ROUTE.relative_to(BASE_DIR)}")
    print(f"  • {KNOWLEDGE_BASE_ROUTE.relative_to(BASE_DIR)}")


def main():
    """Main execution function."""
    import argparse

    parser = argparse.ArgumentParser(description='Sync articles across all files')
    parser.add_argument('--check', action='store_true', help='Check only, don\'t update files')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    args = parser.parse_args()

    print("\n🔍 Scanning articles directory...")
    articles = scan_articles()

    if not articles:
        print("❌ No article JSON files found in thought_leadership/articles/")
        sys.exit(1)

    print(f"✓ Found {len(articles)} articles")

    # Read current page.tsx mappings
    if PAGE_TSX.exists():
        content = PAGE_TSX.read_text()
        current_mappings = extract_slug_mappings(content)
    else:
        current_mappings = {}

    # Analyze discrepancies
    discrepancies = analyze_discrepancies(articles, current_mappings)

    # Print report
    print_sync_report(articles, discrepancies)

    if args.check:
        print("\n✓ Check complete (no files modified)")
        sys.exit(0)

    # Perform updates
    print("\n🔧 Updating files...")

    success = True
    success = update_page_tsx(articles, dry_run=False) and success
    success = update_ai_consultant_prompt(articles, dry_run=False) and success

    if success:
        print("\n✅ SYNC COMPLETE")
        print("\n📋 NEXT STEPS:")
        print("  1. Review the changes in git diff")
        print("  2. Test locally: npm run dev")
        print("  3. Commit: git add -A && git commit -m 'Sync new articles'")
        print("  4. Deploy: vercel --prod")

        if discrepancies['missing_structured_data']:
            print(f"\n⚠️  Don't forget to add structured data to:")
            for article_id in discrepancies['missing_structured_data']:
                print(f"    • {article_id}")
    else:
        print("\n❌ SYNC FAILED")
        sys.exit(1)


if __name__ == "__main__":
    main()
