import requests
from bs4 import BeautifulSoup
import urllib.request
import re
import string

def parse_data(source_plus):

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


def scrape_data(url):
    # get title, then strip title and source -- divided by pipe, dash, dot·
    raw_html = requests.get(url)
    soup = BeautifulSoup(raw_html.text, 'html.parser')


    try: 
        source_plus = soup.title.string.strip()
        re_list = re.split(pattern = r" [\|·\—\-] ", string = source_plus)

        parsed = (parse_data(source_plus))
        title = parsed['title']
        web_source = parsed['source']

    except: 
        web_source = None
    
    try:
        title = soup.title.string.strip()
    except: 
        title = None
    
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

    return {'title': title, 'source': web_source, 'description': description, 
            'icon_img': favicon}

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


def is_YouTube_video(url):
    """Check whether video contains YouTube domains
    
    >>> is_YouTube_video('www.youtube.com/watch?v=K1-nt5_bRlQ')
    True
    >>> is_YouTube_video("https://youtu.be/X5EoUD-BIss?t=12")
    True
    >>> is_YouTube_video("https://youcubed.org")
    False
    """

    if "www.youtube.com" in url or "youtu.be" in url:
        return True
    return False


def get_YouTube_ID(url): 
    """ Take in youtube link and return the YouTube-allocated video ID

    >>> get_YouTube_ID('https://www.youtube.com/watch?v=K1-nt5_bRlQ')
    'K1-nt5_bRlQ'
    >>> get_YouTube_ID('www.youtube.com/watch?v=K1-nt5_bRlQ')
    'K1-nt5_bRlQ'
    >>> get_YouTube_ID("https://youtu.be/X5EoUD-BIss?t=12")
    'X5EoUD-BIss'
    >>> get_YouTube_ID("https://www.youtube.com/watch?v=yAlDDoWfu3I&feature=emb_logo")
    'yAlDDoWfu3I'
    """
    
    if 'watch?v=' in url:
        video_id = url.split('watch?v=')[1]
    elif 'https://youtu.be/' in url:
        video_id = url[17:]
    else: 
        video_id = url
    
    video_id = video_id.split('?')[0]
    video_id = video_id.split('&')[0]

    return video_id


def handle_YouTube(url):
    """ Take in link, determine whether YouTube, and if so, return YouTube dictionary"""
    if is_YouTube_video(url):
        yt_id = get_YouTube_ID(url)
        return {'imgUrl': f'https://img.youtube.com/vi/{yt_id}/0.jpg',
            'url': f'https://www.youtube.com/embed/{yt_id}',
            'yt_id': yt_id, 'type': 'video'}
    else: 
        return{'imgUrl': url, 'url': url, 'type': 'url'}