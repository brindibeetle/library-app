module SearchBook exposing (SearchBook, SearchBooks, hasNext, hasPrevious, get, length, toList, searchbooksDecoder)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)
import RemoteData exposing (RemoteData, WebData, succeed)

import GoogleBookApi as Api exposing (..)


type alias SearchBook = 
    {
        title : String
        , authors : String
        , description : String
        , publishedDate : String
        , language : String
        , smallThumbnail : String
        , thumbnail : String
    }


type alias SearchBooks = 
    {
        searchBookList : Array SearchBook
        , totalItems : Int
    }

-- Opaque
emptySearchbook : SearchBook
emptySearchbook =
    {
        title = ""
        , authors = ""
        , description = ""
        , publishedDate = ""
        , language = ""
        , smallThumbnail = ""
        , thumbnail = ""
    }


-- Opaque
searchbooksDecoder : Decoder SearchBooks
searchbooksDecoder =
    Decode.succeed SearchBooks
        |> required "items" (array searchbookDecoder)
        |> required "totalItems" int



searchbookDecoder : Decoder SearchBook
searchbookDecoder =
    Decode.succeed SearchBook
        |> requiredAt [ "volumeInfo" , "title" ] string
        |> optionalAt [ "volumeInfo" , "authors" ] authorListDecoder ""
        |> optionalAt [ "volumeInfo" , "description" ] string ""
        |> optionalAt [ "volumeInfo" , "publishedDate" ] string ""
        |> optionalAt [ "volumeInfo" , "language" ] string ""
        |> optionalAt [ "volumeInfo" , "imageLinks", "smallThumbnail" ] string ""
        |> optionalAt [ "volumeInfo" , "imageLinks", "thumbnail" ] string ""


-- Opaque
authorListDecoder : Decoder String
authorListDecoder =
    map (String.join ", ") (list string)


hasNext : SearchBooks -> Int -> Bool
hasNext searchbooks index =
    Array.length searchbooks.searchBookList > index + 1


hasPrevious : SearchBooks -> Int -> Bool
hasPrevious searchbooks index =
    index > 0


get : Int -> SearchBooks -> SearchBook
get index searchbooks = 
    let
        maybeSearchbook = Array.get index searchbooks.searchBookList
    in
    case maybeSearchbook of
        Just searchbook ->
            searchbook
    
        Nothing ->
            emptySearchbook


length : SearchBooks -> Int
length searchbooks =
    Array.length searchbooks.searchBookList


toList : SearchBooks -> List SearchBook
toList searchbooks =
    Array.toList searchbooks.searchBookList 