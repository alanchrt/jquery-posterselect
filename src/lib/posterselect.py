import os
import datetime
import subprocess
import hashlib

class Posterselect():
    """A posterselect ffmpeg wrapper class."""

    def __init__(self, video_url='/', video_root='/', poster_url='/',
               poster_root='/', ffmpeg_path='ffmpeg'):
        """Set up initial object"""
        self.video_url = video_url
        self.video_root = video_root
        self.poster_url = poster_url
        self.poster_root = poster_root

    def source_filename(self, url):
        """Determines the filename of the video from its url."""
        return url.replace(self.video_url, '', 1)

    def source_path(self, source_filename):
        """Determines the video path from its filename."""
        return os.path.join(self.video_root, source_filename)

    def destination_filename(self, source_path, time):
        """Determines the poster filename from the video path."""
        timestamp = os.path.getmtime(source_path)
        return '%s-%s.jpg' % (hashlib.sha1(
            source_path + str(timestamp)).hexdigest(), str(time))

    def destination_path(self, destination_filename):
        """Determines the poster image path from its filename."""
        return os.path.join(self.poster_root, destination_filename)

    def destination_url(self, destination_filename):
        """Determines the poster image url from its filename."""
        return self.poster_url + destination_filename

    def ffmpeg(self, source_path, destination_path, time):
        """Runs the ffmpeg command to extract the poster image."""
        hms_time = str(datetime.timedelta(seconds=time))
        try:
            if not os.path.exists(destination_path):
                cmd = ('ffmpeg', '-i', source_path, '-vframes', '1', '-ss',
                       hms_time, '-f', 'image2', '-vcodec', 'mjpeg',
                       destination_path)
                subprocess.Popen(cmd)
        except:
            pass

    def ffprobe(self, source_path):
        """Runs the ffprobe command to determine the video duration."""
        try:
            cmd = ('ffprobe', '-show_streams', source_path)
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
            output = proc.communicate()[0]
            print output
            for line in output.splitlines():
                if line.startswith('duration='):
                    return line.replace('duration=', '')
        except: 
            return "0"

    def extract(self, url, time):
        """Extracts a poster image from the video at the specified time."""
        source_filename = self.source_filename(url)
        source_path = self.source_path(source_filename)
        destination_filename = self.destination_filename(source_path, time)
        destination_path = self.destination_path(destination_filename)
        self.ffmpeg(source_path, destination_path, time)
        return self.destination_url(destination_filename)

    def sniff(self, url):
        """Sniffs the video duration from the video."""
        source_filename = self.source_filename(url)
        source_path = self.source_path(source_filename)
        return self.ffprobe(source_path)

    def posterselect(self, url, time):
        """
        Extracts the poster image and returns a json string for the jQuery
        plugin.
        """
        destination_url = self.extract(url, time)
        return """{
            "posterselect": {
                "video": {
                    "url": "%(source_url)s",
                    "time": "%(time)s"
                },
                "image": {
                    "url": "%(destination_url)s"
                }
            }
        }""" % {
            'source_url': url,
            'time': time,
            'destination_url': destination_url,
        }

    def videoduration(self, url):
        """
        Determines the video duration and returns a json string for the jQuery
        plugin.
        """
        duration = self.sniff(url)
        return """{
            "videoduration": {
                "video": {
                    "url": "%(source_url)s",
                    "duration": %(duration)s
                }
            }
        }""" % {
            'source_url': url,
            'duration': duration,
        }
