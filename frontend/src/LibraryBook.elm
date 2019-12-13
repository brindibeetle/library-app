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
        , publishedDate : String
        , language : String
        , smallThumbnail : String
        , thumbnail : String
        , owner : String
        , location : String
    }


type alias LibraryBooks = 
    {
        libraryBookList : Array LibraryBook
        , totalItems : Int
    }



searchbook2librarybook : SearchBook -> LibraryBook
searchbook2librarybook searchbook =
    {
        id = 0
        , title = searchbook.title
        , authors = searchbook.authors
        , description = searchbook.description
        , publishedDate = searchbook.publishedDate
        , language = searchbook.language
        , smallThumbnail = searchbook.smallThumbnail
        , thumbnail = searchbook.thumbnail
        , owner = ""
        , location = ""
    }


librarybook2String : LibraryBook -> String
librarybook2String libraryBook =
    " id =  " ++ String.fromInt libraryBook.id
    ++ ", title = " ++ libraryBook.title
    ++ ", authors = " ++ libraryBook.authors
    ++ ", description = " ++ libraryBook.description
    ++ ", publishedDate = " ++ libraryBook.publishedDate
    ++ ", language = " ++ libraryBook.language
    ++ ", smallThumbnail = " ++ libraryBook.smallThumbnail
    ++ ", thumbnail = " ++ libraryBook.thumbnail
    ++ ", owner = " ++ libraryBook.owner
    ++ ", location = " ++ libraryBook.location

-- Opaque
emptyLibrarybook : LibraryBook
emptyLibrarybook =
    {
        id = 0
        , title = ""
        , authors = ""
        , description = ""
        , publishedDate = ""
        , language = ""
        , smallThumbnail = ""
        , thumbnail = ""
        , owner = ""
        , location = ""
    }



hasNext : LibraryBooks -> Int -> Bool
hasNext librarybooks index =
    Array.length librarybooks.libraryBookList > index + 1


hasPrevious : LibraryBooks -> Int -> Bool
hasPrevious librarybooks index =
    index > 0


get : Int -> LibraryBooks -> LibraryBook
get index librarybooks = 
    let
        maybeLibraryBook = Array.get index librarybooks.libraryBookList
    in
    case maybeLibraryBook of
        Just librarybook ->
            librarybook
    
        Nothing ->
            emptyLibrarybook


length : LibraryBooks -> Int
length librarybooks =
    Array.length librarybooks.libraryBookList


toList : LibraryBooks -> List LibraryBook
toList librarybooks =
    Array.toList librarybooks.libraryBookList 