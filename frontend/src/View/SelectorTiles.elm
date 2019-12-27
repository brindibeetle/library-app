module View.SelectorTiles exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Array exposing (Array)

import RemoteData exposing (WebData)

import Utils exposing (buildErrorMessage)

import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Spinner as Spinner
import Bootstrap.Card.Block as Block

import Domain.SearchBook exposing (..)
import Utils exposing (..)

import Css exposing (..)


-- #####
-- #####   VIEW
-- #####


type alias Config msg =
    { searchTitle : String 
    , searchAuthors : String 
    , searchString : String 
    -- , searchIsbn : Int
    , updateSearchTitle :  String -> msg 
    , updateSearchAuthor :  String -> msg 
    , updateSearchString :  String -> msg 
    , doSearch : msg
    , doAction : Int -> msg
    , books : WebData (Array SearchBook) 
    }


-- view : WebData (Array (Book a)) -> WebData (Array (Maybe Checkout)) ->  Html Msg
view : Config msg -> Html msg
view config =
    div []
        [ viewBookSearcher config
        , viewBooks config
        ]


viewBookSearcher : Config msg -> Html msg
viewBookSearcher config =
    div [ class "container" ]
        [
            Form.form []
            [ 
              Form.group []
                [ Form.label [ ] [ text "Title"]
                , Input.text [ Input.value config.searchTitle, Input.onInput config.updateSearchTitle ]
                , Form.help [] [ text "What is (part of) the title of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.value config.searchAuthors, Input.onInput config.updateSearchAuthor   ]
                , Form.help [] [ text "What is (part of) the authors of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Keywords"]
                , Input.text [ Input.value config.searchString, Input.onInput config.updateSearchString   ]
                , Form.help [] [ text "Keywords to find the book." ]
                ]
            ]
        ]


viewFetchError : String -> Html msg
viewFetchError errorMessage =
    let
        errorHeading =
            "Couldn't fetch posts at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ errorMessage)
        ]

-- viewBooks : msg -> WebData (Array (Book a)) -> WebData (Array (Maybe Checkout)) -> Html msg
-- viewBooks doSearch books checkoutsCorresponding =
viewBooks : Config msg -> Html msg
viewBooks config =
    let
        { books, doSearch } = config
    in
    case books of
        RemoteData.NotAsked ->
            div [ class "container" ] 
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick doSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                ]

        RemoteData.Loading ->
            div [ class "container" ]
                [ Spinner.spinner
                    [ Spinner.large
                    , Spinner.color Text.primary
                    ]
                    [ Spinner.srMessage "Loading..." ]
                ]

        RemoteData.Success actualBooks ->
            div [ class "containerFluid" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick doSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewBookTiles config actualBooks
                ]
                
        RemoteData.Failure httpError ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick doSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewFetchError (buildErrorMessage httpError) 
                ]

        
viewBookTiles : Config msg -> Array SearchBook -> Html msg
viewBookTiles config books =
    List.range 0 (Array.length books - 1)
        |> List.map2 (viewBookTilesCard config) (Array.toList books)
        |> div [ class "row"  ]


-- "http://books.google.com/books/content?id=qR_NAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
-- zoom=1 -> zoom=10 for better resolution
getthumbnail : SearchBook -> String
getthumbnail book =
    -- String.replace "&zoom=1&" "&zoom=3&" book.thumbnail
    book.smallThumbnail


viewBookTilesCard : Config msg -> SearchBook -> Int -> Html msg
viewBookTilesCard { doAction } book index =
    -- div [ class "col-lg-4 col-md-6 mb-4", onClick (doAction index) ]
    div [ class "col-lg-2 col-md-3 mb-4", onClick (doAction index) ]
        [ 
            Card.config [ Card.attrs [] ]
                |> Card.imgTop [ src (getthumbnail book), class "bookselector-img-top" ] [] 
                |> Card.block [ ] 
                    [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text book.title ]
                    , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text book.authors ]
                    , Block.text [ class "text-muted small bookselector-text-published" ] [ text book.publishedDate ]
                    , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text book.description ]
                    , Block.text [ class "text-muted small bookselector-text-language" ] [ text book.language ]
                    ]
                |> Card.imgBottom [ src (getthumbnail book), class "bookselector-img-bottom" ] [] 
                |> Card.view
        ]

        

-- #####
-- #####   UTILITY
-- #####

setSearchTitle : String -> Config msg -> Config msg 
setSearchTitle title config =
    { config | searchTitle = title }


setSearchAuthors : String -> Config msg -> Config msg 
setSearchAuthors authors config =
    { config | searchAuthors = authors }


setSearchString : String -> Config msg -> Config msg 
setSearchString string config =
    { config | searchString = string }
