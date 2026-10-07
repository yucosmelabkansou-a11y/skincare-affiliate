#!/usr/bin/env python3
"""Add a verified @yun.skincare_ public post from its Instagram URL.

Usage: python3 scripts/add_instagram_post.py URL [--dry-run]
The gallery is built from src/data/instagramPosts.json; redeploy Preview to publish.
"""

import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'src/data/instagramPosts.json'
IMAGES = ROOT / 'public/images/instagram'
USER_AGENT = 'Mozilla/5.0 (compatible; YunSkincarePostImporter/1.0)'
MAX_HTML = 2_000_000
MAX_IMAGE = 8_000_000


class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.values = {}

    def handle_starttag(self, tag, attrs):
        if tag != 'meta':
            return
        attributes = dict(attrs)
        key = attributes.get('property') or attributes.get('name')
        if key in ('og:image', 'og:description'):
            self.values[key] = attributes.get('content', '')


def post_url(raw):
    parsed = urlsplit(raw.strip())
    if parsed.scheme != 'https' or parsed.hostname not in ('instagram.com', 'www.instagram.com') or parsed.port or parsed.username or parsed.password:
        raise ValueError('InstagramのHTTPS投稿URLを指定してください。')
    match = re.fullmatch(r'/(p|reel)/([A-Za-z0-9_-]+)/?', parsed.path)
    if not match:
        raise ValueError('投稿またはリールのURLを指定してください。')
    kind, shortcode = match.groups()
    return f'https://www.instagram.com/{kind}/{shortcode}/', shortcode


def request_bytes(url, limit):
    request = Request(url, headers={'User-Agent': USER_AGENT})
    with urlopen(request, timeout=15) as response:
        body = response.read(limit + 1)
        if len(body) > limit:
            raise ValueError('取得したデータが大きすぎます。')
        return response.geturl(), response.headers.get('Content-Type', ''), body


def allowed_image_host(host):
    return any(host == suffix or host.endswith('.' + suffix) for suffix in ('cdninstagram.com', 'fbcdn.net'))


def get_post(url):
    final_url, _, body = request_bytes(url, MAX_HTML)
    if urlsplit(final_url).hostname not in ('instagram.com', 'www.instagram.com'):
        raise ValueError('Instagramの投稿ページへアクセスできませんでした。')
    parser = MetaParser()
    parser.feed(body.decode('utf-8', 'replace'))
    description = parser.values.get('og:description', '')
    if not re.search(r'\s-\s+yun\.skincare_(?:\s+on\b|\s*:)', description, re.IGNORECASE):
        raise ValueError('@yun.skincare_ の公開投稿と確認できませんでした。')
    image_url = parser.values.get('og:image', '')
    parsed_image = urlsplit(image_url)
    if parsed_image.scheme != 'https' or not allowed_image_host(parsed_image.hostname or ''):
        raise ValueError('投稿画像の取得先を確認できませんでした。')
    title_match = re.search(r'【([^】]{2,80})】', description)
    title = title_match.group(1).strip() if title_match else 'Instagramの投稿'
    return title[:60], image_url


def image_extension(content_type, body):
    if content_type.startswith('image/jpeg') and body.startswith(b'\xff\xd8\xff'):
        return '.jpg'
    if content_type.startswith('image/png') and body.startswith(b'\x89PNG\r\n\x1a\n'):
        return '.png'
    if content_type.startswith('image/webp') and body[:4] == b'RIFF' and body[8:12] == b'WEBP':
        return '.webp'
    raise ValueError('画像の形式を確認できませんでした。')


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('url')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()
    url, shortcode = post_url(args.url)
    posts = json.loads(DATA.read_text(encoding='utf-8'))
    if any(post['href'] == url for post in posts):
        print('登録済みです:', url)
        return
    title, image_url = get_post(url)
    final_image_url, content_type, image_bytes = request_bytes(image_url, MAX_IMAGE)
    if not allowed_image_host(urlsplit(final_image_url).hostname or ''):
        raise ValueError('投稿画像の取得先が変わりました。')
    extension = image_extension(content_type, image_bytes)
    image_path = IMAGES / (shortcode + extension)
    result = {'title': title, 'image': '/images/instagram/' + image_path.name, 'href': url}
    if args.dry_run:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return
    IMAGES.mkdir(parents=True, exist_ok=True)
    image_path.write_bytes(image_bytes)
    temp = DATA.with_suffix('.json.tmp')
    temp.write_text(json.dumps([result, *posts], ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(DATA)
    print('追加しました:', json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, UnicodeError, json.JSONDecodeError) as error:
        print(f'追加できませんでした: {error}', file=sys.stderr)
        sys.exit(1)
