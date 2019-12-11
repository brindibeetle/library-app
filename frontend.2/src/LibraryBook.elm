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
        id : Int
        , title : String
        , authors : String
        , description : String
        -- , publishedDate : String
        -- , language : String
        -- , smallThumbnail : String
        -- , thumbnail : String
        -- , owner : String
        -- , location : String
    }


type alias LibraryBooks = 
    {
        libraryBookList : List LibraryBook
        , totalItems : Int
    }



searchbook2librarybook : SearchBook -> LibraryBook
searchbook2librarybook searchbook =
    {
        id = 0
        , title = searchbook.title
        , authors = searchbook.authors
        , description = searchbook.description
        -- , publishedDate = searchbook.publishedDate
        -- , language = searchbook.language
        -- , smallThumbnail = searchbook.smallThumbnail
        -- , thumbnail = searchbook.thumbnail
        -- , owner = ""
        -- , location = ""
    }


librarybook2String : LibraryBook -> String
librarybook2String libraryBook =
    " id =  " ++ String.fromInt libraryBook.id
    ++ ", title = " ++ libraryBook.title
    ++ ", authors = " ++ libraryBook.authors
    ++ ", description = " ++ libraryBook.description
    -- ++ ", publishedDate = " ++ librarybook.publishedDate
    -- ++ ", language = " ++ librarybook.language
    -- ++ ", smallThumbnail = " ++ librarybook.smallThumbnail
    -- ++ ", thumbnail = " ++ librarybook.thumbnail
    -- ++ ", owner = " ++ librarybook.owner
    -- ++ ", location = " ++ librarybook.location
