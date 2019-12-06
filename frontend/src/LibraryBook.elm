module LibraryBook exposing (..)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)

import SearchBook exposing (..)

type alias LibraryBook = 
    {
        title : String
        , authors : String
        , description : String
        , publishedDate : String
        , language : String
        , smallThumbnail : String
        , thumbnail : String
        , owner : String
        , location : String
    }


type alias LibraryBooks = 
    {
        libraryBookList : List LibraryBook
        , totalItems : Int
    }


librarybooksDecoder : Decoder LibraryBooks
librarybooksDecoder =
    Decode.succeed LibraryBooks
        |> required "items" (list librarybookDecoder)
        |> required "totalItems" int


librarybookDecoder : Decoder LibraryBook
librarybookDecoder =
    Decode.succeed LibraryBook
        |> requiredAt [ "volumeInfo" , "title" ] string
        |> requiredAt [ "volumeInfo" , "authors" ] string
        |> requiredAt [ "volumeInfo" , "description" ] string
        |> optionalAt [ "volumeInfo" , "publishedDate" ] string ""
        |> optionalAt [ "volumeInfo" , "language" ] string ""
        |> optionalAt [ "volumeInfo" , "smallThumbnail" ] string ""
        |> optionalAt [ "volumeInfo" , "thumbnail" ] string ""
        |> optionalAt [ "volumeInfo" , "owner" ] string ""
        |> optionalAt [ "volumeInfo" , "location" ] string ""


librarybook : SearchBook -> LibraryBook
librarybook searchbook =
    {
        title = searchbook.title
        , authors = searchbook.authors
        , description = searchbook.description
        , publishedDate = searchbook.publishedDate
        , language = searchbook.language
        , smallThumbnail = searchbook.smallThumbnail
        , thumbnail = searchbook.thumbnail
        , owner = ""
        , location = ""
    }