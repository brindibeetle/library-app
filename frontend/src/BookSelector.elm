module BookSelector exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http

import RemoteData exposing (RemoteData, WebData, succeed)

import MyError exposing (buildErrorMessage)

import Bootstrap.CDN as CDN
import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Select as Select
import Bootstrap.Form.Checkbox as Checkbox
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Card.Block as Block

import SearchBooks as SearchBooks


type alias Model = 
    {
        searchbooks : WebData (SearchBooks.SearchBooks)
        , searchbookauthor : String 
        , searchbooktitle : String 
    }


initialModel : Model
initialModel =
    { searchbookauthor = ""
    , searchbooktitle = ""
    , searchbooks = RemoteData.NotAsked
    }


init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Cmd.none
    )


view : Model -> Html Msg
view model =
    div []
        [
            CDN.stylesheet
            , Form.form []
            [ 
              Form.group []
                [ Form.label [ ] [ text "Book title"]
                , Input.text [ Input.id "searchbooktitle", Input.onInput UpdateSearchtitle ]
                , Form.help [] [ text "What is (part of) the title of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "searchbookauthor", Input.onInput UpdateSearchauthor ]
                , Form.help [] [ text "What is (part of) the authors of the book." ]
                ]
              , Button.button
                [ Button.primary, Button.attrs [ class "float-right" ], Button.onClick DoSearch ]
                [ text "Search" ]
            , viewBooks model.searchbooks
            ]
        ]


type Msg
    = 
        UpdateSearchauthor String
        | UpdateSearchtitle String
        | DoSearch
        | DoSearchReceived (WebData SearchBooks.SearchBooks)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateSearchtitle title ->
           ( { model | searchbooktitle = title}
           , Cmd.none )

        UpdateSearchauthor author ->
           ( { model | searchbookauthor = author}
           , Cmd.none )

        DoSearch ->
           ( { model | searchbooks = RemoteData.Loading }
           , getBooks model.searchbooktitle model.searchbookauthor )

        DoSearchReceived response ->
           ( { model | searchbooks = response }
           , Cmd.none )


baseUrl : String
baseUrl =
    "https://www.googleapis.com/books/v1/volumes"


getBooks : String -> String -> Cmd Msg
getBooks title author =
    Http.get
        { url = baseUrl ++ "?q=" ++ title ++ "+inauthor:" ++ author
        , expect =
            SearchBooks.searchbooksDecoder
            |> Http.expectJson (RemoteData.fromResult >> DoSearchReceived)
        }

-- VIEW

viewBooks : WebData SearchBooks.SearchBooks -> Html Msg
viewBooks searchbooks =
    case searchbooks of
        RemoteData.NotAsked ->
            h3 [] [ text "Not asked..." ]

        RemoteData.Loading ->
            h3 [] [ text "Loading..." ]

        RemoteData.Success actualSearchBooks ->
            div []
                -- [  text ("Number of books selected " ++ String.fromInt actualSearchBooks.totalItems)
                -- ++
                (viewBooksInCards actualSearchBooks.searchBookList)
                -- , Table.table 
                -- { options = [ Table.hover, Table.bordered, Table.small ]
                -- , thead = Table.thead []
                --     [ Table.tr [ ]
                --         [ Table.th [] [ text "title" ]
                --         , Table.th [] [ text "authors" ]
                --         , Table.th [] [ text "description" ]
                --         , Table.th [] [ text "published" ]
                --         , Table.th [] [ text "language" ]
                --         , Table.th [] [ text "image" ]
                --         ]
                --     ]
                -- , tbody = Table.tbody []
                --     (viewBooksInTable actualSearchBooks.searchBookList)
                -- }
            -- ]

        RemoteData.Failure httpError ->
            viewFetchError (buildErrorMessage httpError)


viewFetchError : String -> Html Msg
viewFetchError errorMessage =
    let
        errorHeading =
            "Couldn't fetch posts at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ errorMessage)
        ]

viewBooksInCards : List (SearchBooks.SearchBook) -> List ( Html Msg )
viewBooksInCards actualSearchBookList =

    List.map viewBookinCard <| actualSearchBookList


viewBookinCard : SearchBooks.SearchBook -> Html Msg
viewBookinCard searchbook =
    Card.config [ Card.align Text.alignXsLeft, Card.attrs [ class "mt-4" ] ]
        -- |> Card.imgTop [ src searchbook.smallThumbnail ] [  ]
        |> Card.block [] (viewBookinCardDetails searchbook)
        |> Card.view


viewBookinCardDetails : SearchBooks.SearchBook -> List (Block.Item msg)
viewBookinCardDetails searchbook =
    [ Block.titleH3 [ ] [ text searchbook.title ]
    , Block.text [] [ text searchbook.description ]
    , Block.titleH6 [] [ text searchbook.authors ]
    , Block.text [] [ text ("Published " ++ searchbook.publishedDate) ]
    , Block.text [] [ text ("Language " ++ searchbook.language) ]
    , Block.custom <| img [ src searchbook.smallThumbnail ] []
    ]

viewBooksInTable : List (SearchBooks.SearchBook) -> List ( Table.Row Msg )
viewBooksInTable actualSearchBookList =

    List.map viewBook <| actualSearchBookList


viewBook : SearchBooks.SearchBook -> Table.Row Msg
viewBook searchbook =

    Table.tr [  ]
        [ Table.td [] [ text searchbook.title ]
        , Table.td [] [ text searchbook.authors ]
        , Table.td [] [ text searchbook.description ]
        , Table.td [] [ text searchbook.publishedDate ]
        , Table.td [] [ text searchbook.language ]
        , Table.td [] [ img [ src searchbook.smallThumbnail ] [] ]
        ]
