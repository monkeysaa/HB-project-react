def is_YouTube_video(link):
    """Check whether video contains YouTube domains
    
    >>> is_YouTube_video('www.youtube.com/watch?v=K1-nt5_bRlQ')
    True
    >>> is_YouTube_video("https://youtu.be/X5EoUD-BIss?t=12")
    True
    >>> is_YouTube_video("https://youcubed.org")
    False
    """

    if "www.youtube.com" in link or "youtu.be" in link:
        return True
    return False


def get_YouTube_ID(link): 
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
    
    if 'watch?v=' in link:
        video_id = link.split('watch?v=')[1]
    elif 'https://youtu.be/' in link:
        video_id = link[17:]
    else: 
        video_id = link
    
    video_id = video_id.split('?')[0]
    video_id = video_id.split('&')[0]

    return video_id


def handle_YouTube(link):
    """ Take in link, determine whether YouTube, and if so, return YouTube dictionary"""
    if is_YouTube_video(link):
        yt_id = get_YouTube_ID(link)
        return {'imgUrl': f'https://img.youtube.com/vi/{yt_id}/0.jpg',
            'url': f'https://www.youtube.com/embed/{yt_id}',
            'yt_id': yt_id}
    else: 
        return{'imgUrl': link, 'url': link}