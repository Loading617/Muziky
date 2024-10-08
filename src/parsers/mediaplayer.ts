export * "./mediaplayer.component"
export * "./tracks";
export * "./artists";
export * "./albums";
export * "./genres";
export * "./playlists";
export * "./folders";
export * "./starred";

export type LibraryItem = Track | Artist | Album | Genre | Playlists | Folders | Starred;
export type LibraryState = { [name: string]: string };
export type PlayerState = { [name: string]: PlayerState };
export type LibraryAction = (state: LibraryState = LibraryState.ACTIVE) => void;
export const LibraryState = { ACTIVE: "active", INACTIVE: "inactive" };

export type PlayerState = {
    track: Track | null;
    isPlaying: boolean;
    volume: number;
  };

  export type PlayerState = {
    artist: Artist | null;
    isPlaying: boolean;
    volume: number;
  };

  export type PlayerState = {
    album: Album | null;
    isPlaying: boolean;
    volume: number;
  };

  export type PlayerState = {
    genre: Genre | null;
    isPlaying: boolean;
    volume: number;
  };

export type Library = { name: string };
export type Track = { name: string };
export type Artist = { name: string };
export type Album = { name: string };
export type Genre = { name: string };
export type Playlists = { name: string };
export type Folders = { name: string };
export type Starred = { name: string };