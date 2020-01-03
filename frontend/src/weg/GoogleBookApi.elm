module GoogleBookApi exposing (..)

import Http
import Array exposing (Array)
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)
-- import Json.Encode as Encode
import Url.Parser exposing (Parser, custom)


type alias JsonRoot = 
    {
        kind : String
        , totalItems : Int
        , items : List JsonItem
    }
type alias JsonItem = 
    {
        kind : String
        , id : String
        -- , etag : String
        -- , selfLink : String
        , volumeInfo : JsonVolumeInfo
    }
type alias JsonVolumeInfo =
    {
        title : String
        , authors : List String
        -- , publisher : String
        , publishedDate : String
        , description : String
        , imageLinks : JsonImageLinks
        , language : String
    }
type alias JsonImageLinks =
    {
        smallThumbnail : String
        , thumbnail : String
    }

jsonRootDecoder : Decoder JsonRoot
jsonRootDecoder = 
    Decode.succeed JsonRoot
        |> required "kind" string
        |> required "totalItems" int
        |> required "items" (list jsonItemDecoder)


jsonItemDecoder : Decoder JsonItem
jsonItemDecoder = 
    Decode.succeed JsonItem
        |> required "kind" string
        |> required "id" string
        |> required "volumeInfo" jsonVolumeInfoDecoder


jsonVolumeInfoDecoder : Decoder JsonVolumeInfo
jsonVolumeInfoDecoder =
    Decode.succeed JsonVolumeInfo
        |> required "title" string
        |> required "authors" (list string)
        |> required "publishedDate" string
        |> required "description" string
        |> required "imageLinks" jsonImageLinksDecoder
        |> required "language" string


jsonImageLinksDecoder : Decoder JsonImageLinks
jsonImageLinksDecoder =
    Decode.succeed JsonImageLinks
        |> required "smallThumbnail" string
        |> required "thumbnail" string


