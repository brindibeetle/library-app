module BookSelector exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
-- import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css)

import Http as Http
import OAuth

import RemoteData exposing (RemoteData, WebData, succeed)

import Utils exposing (buildErrorMessage)

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
import Bootstrap.Spinner as Spinner
import Bootstrap.Card.Block as Block
import Bootstrap.Utilities.Display as Display

import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import BookSelectorDetail exposing (..)
import Session exposing (..)

type alias Model = 
    {
        searchbooks : WebData SearchBooks
        , searchTitle : String 
        , searchAuthors : String 
        , searchString : String 
        -- , searchIsbn : Int
        , bookSelectorDetailModel : Maybe BookSelectorDetail.Model
    }

initialModel : Model
initialModel =
    { searchbooks = RemoteData.NotAsked
    , searchTitle = ""
    , searchAuthors = ""
    , searchString = ""
    -- , searchIsbn = 0
    , bookSelectorDetailModel = Nothing
    }

baseUrl : String
baseUrl =
    "https://www.googleapis.com/books/v1/volumes"


getBooks : { searchString : String, searchAuthors : String, searchTitle : String } -> Cmd Msg
getBooks { searchString, searchAuthors, searchTitle } =
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
            -- ++ if searchIsbn == 0 then
            --     ""
            -- else
            --     "+isbn:" ++ String.fromInt searchIsbn

    in
        Http.get
            { url =  Debug.log "getBooks" (baseUrl ++ "?q=" ++ query )
            , expect =
                searchbooksDecoder
                |> Http.expectJson (RemoteData.fromResult >> DoSearchReceived)
            }

-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    div [ class "center" ]
        [ viewBookSearcher model
        , viewBooks model.searchbooks
        ]


viewBookSearcher : Model -> Html Msg
viewBookSearcher model =
    div [ class "container" ]
        [
            p [] 
                [ text "Search for books via Google's Books Api."
                , br [] []
                , text "Find your book, and add it easily to the library."
                ]
            , Form.form []
                [ 
                Form.group []
                    [ Form.label [ ] [ text "Title"]
                    , Input.text [ Input.id "searchTitle", Input.onInput UpdateTitle ]
                    , Form.help [] [ text "What is (part of) the title of the book." ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Author(s)"]
                    , Input.text [ Input.id "searchAuthors", Input.onInput UpdateAuthors ]
                    , Form.help [] [ text "What is (part of) the authors of the book." ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Keywords"]
                    , Input.text [ Input.id "searchString", Input.onInput UpdateString ]
                    , Form.help [] [ text "Keywords to find the book." ]
                    ]
            --   , Form.group []
            --     [ Form.label [ ] [ text "Isbn"]
            --     , Input.number [ Input.id "searchIsbn", Input.onInput UpdateIsbn ]
            --     , Form.help [] [ text "Isbn." ]
            --     ]
            ]
                                       
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


viewBooks : WebData SearchBooks -> Html Msg
viewBooks searchbooks =
   -- viewBooks model.searchbooks
    case searchbooks of
        RemoteData.NotAsked ->
            div [ class "container" ] 
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                ]

        RemoteData.Loading ->
            div [ class "container" ]
                [ Spinner.spinner
                    [ Spinner.grow
                    , Spinner.large
                    , Spinner.color Text.primary
                    ]
                    [ Spinner.srMessage "Loading..." ]
                ]

        RemoteData.Success actualSearchBooks ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewBookTiles actualSearchBooks 
                ]
                
        RemoteData.Failure httpError ->
            div [ class "container" ]
                [ Button.button
                    [ Button.primary, Button.attrs [ class "float-left" ], Button.onClick DoSearch ]
                    [ text "Search" ]
                    , p [] [ br [] [] ]
                , viewFetchError (buildErrorMessage httpError) 
                ]


viewBookTiles : SearchBooks -> Html Msg
viewBookTiles searchbooks =
    List.range 0 (Domain.SearchBook.length searchbooks - 1)
        |> List.map2 viewBookTilesCard (Domain.SearchBook.toList searchbooks)
        |> div [ class "row"  ]


-- "http://books.google.com/books/content?id=qR_NAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
-- zoom=1 -> zoom=10 for better resolution
getthumbnail : SearchBook -> String
getthumbnail searchbook =
    String.replace "&zoom=1&" "&zoom=3&" searchbook.thumbnail

viewBookTilesCard : SearchBook -> Int -> Html Msg
viewBookTilesCard searchbook index =
    div [ class "col-lg-4 col-md-6 mb-4", onClick (ClickedBookDetail searchbook index) ]
    [
    -- Card.config [ Card.attrs [ style "width" "20rem", style "height" "35rem"  ]  ]
       Card.config [ Card.attrs [ ] ]
        |> Card.imgTop [ src (getthumbnail searchbook), class "bookselector-img-top" ] [] 
        |> Card.block [ ] 
            [ Block.titleH4 [ class "card-title text-truncate bookselector-text-title" ] [ text searchbook.title ]
            , Block.titleH6 [ class "text-muted bookselector-text-author" ] [ text searchbook.authors ]
            , Block.text [ class "text-muted small bookselector-text-published" ] [ text searchbook.publishedDate ]
            , Block.text [ class "card-text block-with-text bookselector-text-description" ] [ text searchbook.description ]
            , Block.text [ class "text-muted small bookselector-text-language" ] [ text searchbook.language ]
            ]
        |> Card.imgBottom [ src (getthumbnail searchbook), class "bookselector-img-bottom" ] [] 
        |> Card.view
    ]


-- #####
-- #####   UPDATE
-- #####


type Msg
    = 
        UpdateAuthors String
        | UpdateTitle String
        | UpdateString String
        | DoSearch
        | DoSearchReceived (WebData SearchBooks)
        | ClickedBookDetail SearchBook Int


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdateTitle title ->
           { model = { model | searchTitle = title }
           , session = session
           , cmd = Cmd.none }

        UpdateAuthors authors ->
           { model = { model | searchAuthors = authors }
           , session = session
           , cmd = Cmd.none }

        UpdateString string ->
           { model = { model | searchString = string }
           , session = session
           , cmd = Cmd.none }

        DoSearch ->
           { model =  { model | searchbooks = RemoteData.Loading }
           , session = session
           , cmd = getBooks { searchTitle = model.searchTitle, searchAuthors = model.searchAuthors, searchString = model.searchString }
           }

        DoSearchReceived response ->
            { model =  { model | searchbooks = response }
            , session = session
            , cmd = Cmd.none }

        ClickedBookDetail searchbook index ->
            case model.searchbooks of
                RemoteData.Success actualSearchBooks ->
                    { model = 
                        { model 
                        | bookSelectorDetailModel = Just (BookSelectorDetail.initialModel (getUser session) actualSearchBooks index)
                        }
                    , session = changedPageSession BookSelectorDetailPage session
                    , cmd = Cmd.none }
                
                _ ->
                    { model = model, session = session, cmd = Cmd.none }
