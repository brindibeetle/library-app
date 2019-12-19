module LibraryAppApi exposing (..)

import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)

import Http exposing (..)
import OAuth

import RemoteData exposing (RemoteData, WebData, succeed)

import Domain.LibraryBook exposing (..)
import Utils exposing (..)



libraryBookEncoder : LibraryBook -> Encode.Value
libraryBookEncoder libraryBook =
    Encode.object
        [ ( "id", Encode.int libraryBook.id )
        , ( "title", Encode.string libraryBook.title )
        , ( "authors", Encode.string libraryBook.authors )
        , ( "description", Encode.string libraryBook.description )
        , ( "publishedDate", Encode.string libraryBook.publishedDate )
        , ( "language", Encode.string libraryBook.language )
        , ( "smallThumbnail", Encode.string libraryBook.smallThumbnail )
        , ( "thumbnail", Encode.string libraryBook.thumbnail )
        , ( "owner", Encode.string libraryBook.owner )
        , ( "location", Encode.string libraryBook.location )
        ]


newLibraryBookEncoder : LibraryBook -> Encode.Value
newLibraryBookEncoder libraryBook =
    let a = Debug.log "libraryBookEncoder" libraryBook
    in
    Encode.object
        [ ( "title", Encode.string libraryBook.title )
        , ( "authors", Encode.string libraryBook.authors )
        , ( "description", Encode.string libraryBook.description )
        , ( "publishedDate", Encode.string libraryBook.publishedDate )
        , ( "language", Encode.string libraryBook.language )
        , ( "smallThumbnail", Encode.string libraryBook.smallThumbnail )
        , ( "thumbnail", Encode.string libraryBook.thumbnail )
        , ( "owner", Encode.string libraryBook.owner )
        , ( "location", Encode.string libraryBook.location )
        ]



-- (WebData (Array LibraryBook))