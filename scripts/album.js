var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  // #1
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    // #2
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);
};

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
}
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' +
    '</tr>';

  var $row = $(template);


  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({
        left: currentVolume + '%'
      });

      $(this).html(pauseButtonTemplate);
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
      } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }
    console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
  };

  // #1
  $row.find('.song-item-number').click(clickHandler);
  // #2
  $row.hover(onHover, offHover);
  // #3
  return $row;
};

var $albumImage = $('.album-cover-art');

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumSongList = $('.album-view-song-list');
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  // #3
  $albumSongList.empty();

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    // #10
    currentSoundFile.bind('timeupdate', function(event) {
      // #11
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      setCurrentTimeInPlayerBar(this.getTime());
      setTotalTimeInPlayerBar(this.getDuration());
      updateSeekPercentage($seekBar, seekBarFillRatio);
      //setCurrentTimeInPlayerBar();
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  // #1
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  // #2
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({
    left: percentageString
  });
};

var setupSeekBars = function() {
  //#6
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    // #3
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    // #4
    var seekBarFillRatio = offsetX / barWidth;

    //conditional to check if the seek bar is changing the volume or going to the position of the song
    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }
    // #5
    updateSeekPercentage($(this), seekBarFillRatio);
  });
  // #7
  $seekBars.find('.thumb').mousedown(function(event) {
    // #8
    var $seekBar = $(this).parent();

    // #9
    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($seekBar.parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    // #10
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
      //we use the unbind event method to make sure that the thumb and fill stop moving after the mouse is released
    });
  });
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
}

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }



  var lastSongNumber = currentlyPlayingSongNumber;
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  updatePlayerBarSong();
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
}


var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _decrementing_ the index here
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  updatePlayerBarSong();
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
}

var updatePlayerBarSong = function() {
  var lastSongNumber = currentlyPlayingSongNumber;
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
// Store state of playing songs

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
var albums = [albumPicasso, albumMarconi, albumPetty];
var index = 1;
$albumImage.click(doThisOnClick);


//function togglePlayFromPlayerBar(){}

function togglePlayFromPlayerBar() {}

/*if (currentlyPlayingSongNumber === songNumber) {
        $('.main-controls .play-pause').click(togglePlayFromPlayerBar());
      });

    function togglePlayFromPlayerBar(){
      setSong(1);
      if (currentlyPlayingSongNumber === songNumber) {
        if (currentSoundFile.isPaused()) {
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.play();
        } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
        }
      }*/

function setCurrentTimeInPlayerBar(currentTime) {
  //set the text of the element with the class .current-time to the current time in the song.
  $('.current-time').html(filterTimeCode(currentTime));
}

function filterTimeCode(timeInSeconds) {
  var time = parseInt(timeInSeconds);
  var sec = Math.floor(time % 60);
  var min = Math.floor(time / 60);
  return min + ":" + (sec < 10 ? '0' + sec : sec);
}

function setTotalTimeInPlayerBar(totalTime) {
  $('.total-time').html(filterTimeCode(totalTime));
}

function doThisOnClick(event) {
  setCurrentAlbum(albums[index]);
  index++;
  if (index == albums.length) {
    index = 0;
  }
}
