// Example Album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};
// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};
//checkpoint 11 submission
var albumPetty = {
    title:  'Full Moon Fever',
    artist: 'Tom Petty and the Heartbreakers',
    label:  'MCA Records',
    year:   '1989',
    albumArtUrl:  'assets/images/album_covers/Tom_Petty_Album_Cover.jpg',
    songs:  [
        { title: 'Free Fallin', duration: '4:16'},
        { title: 'I Wont Back Down', duration: '2:57'},
        { title: 'Love is a Long Road', duration: '4:08'},
        { title: 'A Face in the Crowd', duration: '3:59'},
        { title: 'Runnin Down a Dream', duration: '4:52'},
        { title: 'Fell a Whole Lot Better', duration: '2:50'},
        { title: 'Yer So Bad', duration: '3:06'},
        { title: 'Depending on You', duration: '2:49'},
        { title: 'The Apartment Song', duration: '2:33'},
        { title: 'Alright for Now', duration: '2:01'},
        { title: 'A Mind With a Heart of Its Own', duration: '3:31'},
        { title: 'Zombie Zoo', duration: '2:59'}
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    return template;
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // #3
    albumSongList.innerHTML = '';

    // #4
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    var albums = [albumPicasso, albumMarconi, albumPetty];
    var index = 1;
    albumImage.addEventListener("click", function(event){
        setCurrentAlbum(albums[index]);
        index++;
        if (index == album.length) {
          index = 0;
        }
    });
};
