module BookSelector exposing (..)

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

import SearchBook exposing (..)
import LibraryBook exposing (..)
import BookSelectorDetail exposing (..)
import BookSelectorTiles exposing (..)

type alias Model = 
    {
        searchbooks : WebData SearchBooks
        , searchbookauthor : String 
        , searchbooktitle : String 
        , bookSelectorTilesModel : BookSelectorTiles.Model
        , bookSelectorDetailModel : Maybe BookSelectorDetail.Model
    }

type BookSelectorViewLevel =
    Tiles
    | Detail

initialModel : Maybe OAuth.Token -> Model
initialModel maybeToken =
    { searchbookauthor = ""
    , searchbooktitle = ""
    , searchbooks = RemoteData.NotAsked
    , bookSelectorTilesModel = BookSelectorTiles.initialModel RemoteData.NotAsked
    , bookSelectorDetailModel = Nothing
    }


-- init : ( Model, Cmd Msg )
-- init =
--     ( initialModel
--     , Cmd.none
--     )


type Msg
    = 
        UpdateSearchauthor String
        | UpdateSearchtitle String
        | DoSearch
        | DoSearchReceived (WebData SearchBooks)
        -- | DoBookDetail SearchBook
        | BookSelectorTilesMsg BookSelectorTiles.Msg
        | BookSelectorDetailMsg BookSelectorDetail.Msg


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
            let
                bookSelectorTilesModel = BookSelectorTiles.initialModel response
            in
            ( 
                { model 
                | searchbooks = response 
                , bookSelectorTilesModel = bookSelectorTilesModel
                }
            , Cmd.none )

        BookSelectorTilesMsg subMsg ->
            let
                ( bookSelectorTilesModelUpdated, cmd) = BookSelectorTiles.update subMsg model.bookSelectorTilesModel
                bookSelectDetailModel = model.bookSelectorDetailModel
            in
                case ( bookSelectorTilesModelUpdated.active ,bookSelectorTilesModelUpdated.searchbook ) of 
                    (False, Just searchbook ) ->        -- False = deactivated, now Details becomes active
                        ( { model
                            | bookSelectorTilesModel = bookSelectorTilesModelUpdated
                            , bookSelectorDetailModel = Just (BookSelectorDetail.initialModel bookSelectorTilesModelUpdated.searchbooks searchbook)
                            }
                        , Cmd.none )
                
                    _ ->
                        ( model , Cmd.none)
                    
        BookSelectorDetailMsg subMsg ->
            case model.bookSelectorDetailModel of
                Just bookSelectorDetailModel ->
                    let
                        ( bookSelectorDetailModelUpdated, cmd) = BookSelectorDetail.update subMsg bookSelectorDetailModel
                        bookSelectTilesModel = model.bookSelectorTilesModel
                    in
                        case bookSelectorDetailModelUpdated.active of
                            False ->                    -- False = deactivated, now Tiles becomes active
                                ( { model
                                  | bookSelectorDetailModel = Nothing
                                  , bookSelectorTilesModel = BookSelectorTiles.initialModel bookSelectorDetailModelUpdated.searchbooks
                                  }
                                , Cmd.none )
                        
                            _ ->
                                ( { model
                                  | bookSelectorDetailModel = Just bookSelectorDetailModelUpdated
                                  }
                                , Cmd.none )
            
                _ ->
                    ( model , Cmd.none)
                    


baseUrl : String
baseUrl =
    "https://www.googleapis.com/books/v1/volumes"


getBooks : String -> String -> Cmd Msg
getBooks title author =
    Http.get
        { url = baseUrl ++ "?q=" ++ title ++ "+inauthor:" ++ author
        , expect =
            searchbooksDecoder
            |> Http.expectJson (RemoteData.fromResult >> DoSearchReceived)
        }

-- VIEW
view : Model -> Html Msg
view model =
    case model.bookSelectorDetailModel of
        Just bookSelectorDetailModel ->
            div []
                [ viewBookSearcher True model
                , BookSelectorDetail.view bookSelectorDetailModel |> Html.map BookSelectorDetailMsg
                ]
    
        Nothing ->
            div []
                [ viewBookSearcher False model
                , BookSelectorTiles.view model.bookSelectorTilesModel |> Html.map BookSelectorTilesMsg
                ]


viewBookSearcher : Bool -> Model -> Html Msg
viewBookSearcher disabled model =
    
    div [ class "container" ]
        [
            Form.form []
            [ 
              Form.group []
                [ Form.label [ ] [ text "Book title"]
                , Input.text [ Input.id "searchbooktitle", Input.onInput UpdateSearchtitle, Input.disabled disabled  ]
                , Form.help [] [ text "What is (part of) the title of the book." ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "searchbookauthor", Input.onInput UpdateSearchauthor, Input.disabled disabled   ]
                , Form.help [] [ text "What is (part of) the authors of the book." ]
                ]
              , Button.button
                [ Button.primary, Button.attrs [ class "float-right" ], Button.onClick DoSearch, Button.disabled disabled   ]
                [ text "Search" ]
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


