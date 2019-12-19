module Domain.LibraryBook exposing (..)

import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
import OAuth
import RemoteData exposing (WebData)
import Http

import Domain.SearchBook exposing (..)
import Utils exposing (..)

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


libraryApiBooksUrl : String
libraryApiBooksUrl = libraryApiBaseUrl ++ "/books"


getBooks : { token : OAuth.Token, msg : (WebData (Array LibraryBook) -> msg), title : String, author : String, location : String, owner : String } -> Cmd msg
getBooks { token, msg, title, author, location, owner } =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" libraryApiBooksUrl ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect = 
                libraryBooksDecoder
                |> Http.expectJson (RemoteData.fromResult >> msg)
            }


libraryBooksDecoder : Decoder (Array LibraryBook)
libraryBooksDecoder =
    Decode.array libraryBookDecoder


libraryBookDecoder : Decoder LibraryBook
libraryBookDecoder =
    Decode.succeed LibraryBook
        |> required "id" int
        |> required "title" string
        |> required "authors" string
        |> required "description" string
        |> optional "publishedDate" string ""
        |> optional "language" string ""
        |> optional "smallThumbnail" string ""
        |> optional "thumbnail" string ""
        |> optional "owner" string ""
        |> optional "location" string ""



hasNext : (Array LibraryBook) -> Int -> Bool
hasNext librarybooks index =
    Array.length librarybooks > index + 1


hasPrevious : (Array LibraryBook) -> Int -> Bool
hasPrevious librarybooks index =
    index > 0


get : Int -> (Array LibraryBook) -> LibraryBook
get index librarybooks = 
    let
        maybeLibraryBook = Array.get index librarybooks
    in
    case maybeLibraryBook of
        Just librarybook ->
            librarybook
    
        Nothing ->
            emptyLibrarybook


length : (Array LibraryBook) -> Int
length librarybooks =
    Array.length librarybooks


toList : (Array LibraryBook) -> List LibraryBook
toList librarybooks =
    Array.toList librarybooks