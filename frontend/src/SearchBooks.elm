module SearchBooks exposing (..)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)

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
        searchBookList : List SearchBook
        , totalItems : Int
    }


searchbooksDecoder : Decoder SearchBooks
searchbooksDecoder =
    Decode.succeed SearchBooks
        |> required "items" (list searchbookDecoder)
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


authorListDecoder : Decoder String
authorListDecoder =
    map (String.join ", ") (list string)
