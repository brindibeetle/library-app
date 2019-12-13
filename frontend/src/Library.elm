module Library exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)

import Http as Http
import OAuth

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
import Bootstrap.Utilities.Display as Display

import SearchBook exposing (..)
import LibraryBook exposing (..)
import BookSelectorDetail exposing (..)
import Session exposing (..)
import LibraryAppApi exposing (..)

import Css exposing (..)

type alias Model = 
    {
        librarybooks : WebData LibraryBooks
        , searchTitle : String 
        , searchAuthor : String 
        , searchLocation : String 
        , searchOwner : String 
    }

type BookSelectorViewLevel =
    Tiles
    | Detail


initialModel : Model
initialModel =
    { librarybooks = RemoteData.NotAsked
    , searchTitle = ""
    , searchAuthor = ""
    , searchLocation = ""
    , searchOwner = ""
    }

getBooks : OAuth.Token -> String -> String -> String -> String -> Cmd Msg
getBooks token title author location owner =
    let
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" LibraryAppApi.libraryApiBooksUrl ++ "?access_token=" ++ puretoken
    in
        Http.get
            { url = requestUrl
            , expect = 
                libraryBooksDecoder
                |> Http.expectJson (RemoteData.fromResult >> DoSearchReceived)
            }


-- VIEW
view : Model -> Html Msg
view model =
    div []
        [ viewBookSearcher model
        , viewBooks model.librarybooks
        ]


viewBookSearcher : Model -> Html Msg
viewBookSearcher model =
    div [ class "container" ]
        [
            Form.form []
            [ 
              Form.group []
                [ Form.label [ ] [ text "Title"]
                , Input.text [ Input.id "searchbookTitle", Input.onInput UpdateSearchTitle ]
                , Form.help [] [ text "What is (part of) the title of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "searchbookAuthor", Input.onInput UpdateSearchAuthor   ]
                , Form.help [] [ text "What is (part of) the authors of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Location"]
                , Input.text [ Input.id "searchbookLocation", Input.onInput UpdateSearchLocation   ]
                , Form.help [] [ text "What is the location of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Owner of the book"]
                , Input.text [ Input.id "searchbookOwner", Input.onInput UpdateSearchOwner   ]
                , Form.help [] [ text "Who is the owner of the book." ]
                ]
            ]
            , Button.button
                [ Button.primary, Button.attrs [ class "float-right" ], Button.onClick DoSearch ]
                [ text "Search" ]
        ]


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



viewBooks : WebData LibraryBooks -> Html Msg
viewBooks libraryBooks =
   -- viewBooks model.searchbooks
    case libraryBooks of
        RemoteData.NotAsked ->
            div [ class "row" ]
                [ text "Not asked..." ]

        RemoteData.Loading ->
            div [ class "row" ]
                [ text "Loading..." ]

        RemoteData.Success actualLibraryBooks ->
            viewBookTiles actualLibraryBooks
                
        RemoteData.Failure httpError ->
            viewFetchError (buildErrorMessage httpError)


viewBookTiles : LibraryBooks -> Html Msg
viewBookTiles libraryBooks =
    List.range 0 (LibraryBook.length libraryBooks - 1)
        |> List.map2 viewBookTilesCard (LibraryBook.toList libraryBooks)
        |> div [ class "row" ]


viewBookTilesCard : LibraryBook -> Int -> Html Msg
viewBookTilesCard libraryBook index =
    div [ class "col-sm-6 col-lg-4" ]
    [
    Card.config [ Card.attrs [ style "width" "20rem", style "height" "35rem"  ]  ]
        |> Card.block [] 
            [ Block.titleH6 [ ] [ text libraryBook.title ]
            , Block.custom <| img [ src libraryBook.smallThumbnail, Display.inlineBlock, style "width" "12rem" ] []
            , Block.text [ class "text-muted small" ] [ text libraryBook.description ]
            , Block.titleH6 [] [ text libraryBook.authors ]
            , Block.text [] [ text ("Published " ++ libraryBook.publishedDate) ]
            , Block.text [] [ text ("Language " ++ libraryBook.language) ]
            ]
        |> Card.view
    ]


-- #####
-- ##### UPDATE
-- #####


type Msg
    = 
        UpdateSearchTitle String
        | UpdateSearchAuthor String
        | UpdateSearchLocation String
        | UpdateSearchOwner String
        | DoSearch
        | DoSearchReceived (WebData LibraryBooks)
        -- | ClickedBookDetail LibraryBook Int


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdateSearchTitle title ->
           { model = { model | searchTitle = title }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchAuthor author ->
           { model = { model | searchAuthor = author }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchLocation location ->
           { model = { model | searchLocation = location }
           , session = session
           , cmd = Cmd.none }

        UpdateSearchOwner owner ->
           { model = { model | searchOwner = owner }
           , session = session
           , cmd = Cmd.none }

        DoSearch ->
            case session.token of
                Just token ->
                    { model =  { model | librarybooks = RemoteData.Loading }
                    , session = session
                    , cmd = getBooks token model.searchTitle model.searchAuthor model.searchLocation model.searchOwner }
                Nothing ->
                    { model = model, session = session, cmd = Cmd.none }

        DoSearchReceived response ->
            { model =  { model | librarybooks = response }
            , session = session
            , cmd = Cmd.none }

        -- ClickedBookDetail searchbook index ->
        --     case model.librarybooks of
        --         RemoteData.Success actualLibraryBooks ->
        --             { model = 
        --                 { model 
        --                 | bookSelectorDetailModel = Just (BookSelectorDetail.initialModel actualSearchBooks index)
        --                 }
        --             , session = changedPageSession BookSelectorDetailPage session
        --             , cmd = Cmd.none }
                
        --         _ ->
        --             { model = model, session = session, cmd = Cmd.none }
