#!/usr/bin/env python3.6
"""Functions to handle data-scraping and YouTube processing"""

import requests
from bs4 import BeautifulSoup
import urllib.request
import re
import string


def scrape_data(url):
    "Use Beautiful Soup and url metadata to parse url title and source."

    # get title
    raw_html = requests.get(url)
    soup = BeautifulSoup(raw_html.text, 'html.parser')

    try: 
        source_plus = soup.title.string.strip()
        # PHIL If you have to have the same RE over and over, then
        # compile it once and stick it in a variable
        # bs_re = re.compile(....)
        re_list = re.split(pattern = r" [\|·\—\-] ", string = source_plus)

        parsed = (parse_data(source_plus))
        title = parsed['title']
        web_source = parsed['source']

    except: 
        web_source = 'Source Unknown'
        title = source_plus
    
    try: 
        description_plus = soup.select('meta[name="description"]')
        description = description_plus[0].attrs["content"]
    except: 
        description = None

    try: 
        icon_link = soup.find('link', rel='icon')
        favicon = icon_link['href']
    except: 
        favicon = None

    return {'title': title, 'source': web_source, 'descr': description, 
            'favicon': favicon}


def parse_data(source_plus):
    """Separate title and source, often divided by pipe, dash, or dot"""

    # NOTE: | · — - Pipe, dot, em and en dashes often separate titles from 
    # their sources (e.g. Cookie Monster Practices Self-Regulation | Life Kit
    # Parenting | NPR). 
    # TODO: This is a rough approximation. Look into other models.
    re_list = re.split(pattern = r" [\|·\—\-] ", string = source_plus)
    if len(re_list) == 2:
        return {'source': re_list[1].strip(), 'title': re_list[0].strip('|·—-')}

    elif len(re_list) <= 1:
        return {'source': None, 'title': re_list[0]}

    elif len(re_list) > 2:
        web_source = re_list[-1]
        title = re.split(pattern = web_source, string = source_plus)[0]
        return {'source': web_source, 'title': title.strip('|·—- ')}
    
    else:
        return "Error while parsing"


# TODO: Build function to check whether a url won't display in iFrame 
# def isIFrameDisabled(url):
#     try: 
        # get headers
        # Make sure it's lowercase
        # Check Content-Security-Policy
        # If Content-SEcurity-Policy set --> return True
        # Check X-Frame Options
        # Elif X-Frame set to DENY OR SAMEORIGIN --> return True
        # Else return false


def is_youtube_video(url):
    """Check whether video contains YouTube domains
    
    >>> is_youtube_video('www.youtube.com/watch?v=K1-nt5_bRlQ')
    True
    >>> is_youtube_video("https://youtu.be/X5EoUD-BIss?t=12")
    True
    >>> is_youtube_video("https://youcubed.org")
    False
    """

    # You don't need an `if` to return a bool when you have
    # a bool already:
    # return "www.youtube.com" in url or "youtu.be" in url
    if "www.youtube.com" in url or "youtu.be" in url:
        return True
    return False


def get_youtube_id(url): 
    """ Take in youtube link and return the YouTube-allocated video ID

    >>> get_youtube_id('https://www.youtube.com/watch?v=K1-nt5_bRlQ')
    'K1-nt5_bRlQ'
    >>> get_youtube_id('www.youtube.com/watch?v=K1-nt5_bRlQ')
    'K1-nt5_bRlQ'
    >>> get_youtube_id("https://youtu.be/X5EoUD-BIss?t=12")
    'X5EoUD-BIss'
    >>> get_youtube_id("https://www.youtube.com/watch?v=yAlDDoWfu3I&feature=emb_logo")
    'yAlDDoWfu3I'
    """
    
    if 'watch?v=' in url:
        video_id = url.split('watch?v=')[1]
    elif 'https://youtu.be/' in url:
        video_id = url[17:]
    else: 
        video_id = url
    # PHIL: there are great libraries to parse URLParams,
    # use one. They're usually called CGI something or URL something
    video_id = video_id.split('?')[0]
    video_id = video_id.split('&')[0]

    return video_id


def handle_url(url):
    """ Determine whether YouTube link, and if so, return YouTube dictionary"""
    if is_youtube_video(url):
        yt_id = get_youtube_id(url)
        return {'imgUrl': f'https://img.youtube.com/vi/{yt_id}/0.jpg',
            'url': f'https://www.youtube.com/embed/{yt_id}',
            'yt_id': yt_id, 'type': 'video'}
    else: 
        return{'imgUrl': url, 'url': url, 'yt_id': None, 'type': 'url'}