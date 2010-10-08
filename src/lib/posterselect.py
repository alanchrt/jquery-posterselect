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

    def run(self, source_path, destination_path, time):
        """Runs the ffmpeg command to extract the poster image."""
        hms_time = str(datetime.timedelta(seconds=time))
        if not os.path.exists(destination_path):
            cmd = ('ffmpeg', '-i', source_path, '-vframes', '1', '-ss',
                   hms_time, '-f', 'image2', '-vcodec', 'mjpeg',
                   destination_path)
            print ' '.join(cmd)
            subprocess.Popen(cmd)

    def extract(self, url, time):
        """Extracts a poster image from the video at the specified time."""
        source_filename = self.source_filename(url)
        source_path = self.source_path(source_filename)
        destination_filename = self.destination_filename(source_path, time)
        destination_path = self.destination_path(destination_filename)
        self.run(source_path, destination_path, time)
        return self.destination_url(destination_filename)

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
