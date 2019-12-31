module Domain.SearchBook exposing (SearchBook, SearchBooks, hasNext, hasPrevious, get, length, toList, searchbooksDecoder, getBooks)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)
import RemoteData exposing (RemoteData, WebData, succeed)


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
        -- , totalItems : Int
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


-- searchbooksDecoder : Decoder (SearchBooks)
-- searchbooksDecoder =
--     Decode.succeed SearchBooks
--         |> required "items" (array searchbookDecoder)
--         |> required "totalItems" int
searchbooksDecoder : Decoder (Array SearchBook)
searchbooksDecoder =
    Decode.field "items" (array searchbookDecoder)


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
    Decode.map (String.join ", ") (list string)


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


baseUrl : String
baseUrl =
    "https://www.googleapis.com/books/v1/volumes"


getBooks : (WebData (Array SearchBook) -> msg) -> { searchString : String, searchAuthors : String, searchTitle : String, searchIsbn : Int } -> Cmd msg
getBooks msg { searchString, searchAuthors, searchTitle, searchIsbn } =
    let
        a = Debug.log "getBooks searchAuthors" searchAuthors
        
        query = searchString
            ++
            (
                if searchTitle == "" then
                    ""
                else
                    "+intitle:" ++ searchTitle
            )
            ++
            (
                if searchAuthors == "" then
                    ""
                else
                    "+inauthor:" ++ searchAuthors
            )
            ++ if searchIsbn == 0 then
                ""
            else
                "+isbn:" ++ String.fromInt searchIsbn

    in
        Http.get
            { url =  Debug.log "getBooks" (baseUrl ++ "?q=" ++ query )
            , expect =
                searchbooksDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }
