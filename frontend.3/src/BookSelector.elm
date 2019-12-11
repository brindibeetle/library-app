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
import Bootstrap.Utilities.Display as Display

import SearchBook exposing (..)
import LibraryBook exposing (..)
import BookSelectorDetail exposing (..)
import Page exposing (..)
-- import BookSelectorTiles exposing (..)
import Session exposing (..)

type alias Model = 
    {
        session : Session
        , searchbooks : WebData SearchBooks
        , searchbookauthor : String 
        , searchbooktitle : String 
        -- , bookSelectorTilesModel : BookSelectorTiles.Model
        , bookSelectorDetailModel : Maybe BookSelectorDetail.Model
    }

type BookSelectorViewLevel =
    Tiles
    | Detail


initialModel : Session -> Maybe OAuth.Token -> Model
initialModel session maybeToken =
    { session = session
    , searchbookauthor = ""
    , searchbooktitle = ""
    , searchbooks = RemoteData.NotAsked
    -- , bookSelectorTilesModel = BookSelectorTiles.initialModel RemoteData.NotAsked
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
        | ClickedBookDetail SearchBook
        -- | BookSelectorTilesMsg BookSelectorTiles.Msg


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
            ( 
                { model 
                | searchbooks = response 
                }
            , Cmd.none )

        -- BookSelectorTilesMsg subMsg ->
        --     let
        --         ( bookSelectorTilesModelUpdated, cmd) = BookSelectorTiles.update subMsg model.bookSelectorTilesModel
        --         bookSelectDetailModel = model.bookSelectorDetailModel
        --     in
        --         case ( bookSelectorTilesModelUpdated.active ,bookSelectorTilesModelUpdated.searchbook ) of 
        --             (False, Just searchbook ) ->        -- False = deactivated, now Details becomes active
        --                 ( { model
        --                     | bookSelectorTilesModel = bookSelectorTilesModelUpdated
        --                     , bookSelectorDetailModel = Just (BookSelectorDetail.initialModel bookSelectorTilesModelUpdated.searchbooks searchbook)
        --                     }
        --                 , Cmd.none )
                
        --             _ ->
        --                 ( model , Cmd.none)
                    
 
        ClickedBookDetail searchbook ->
            let
                session = model.session
            in
                ( { model 
                | session = changedPageSession BookSelectorDetailPage session
                , bookSelectorDetailModel = Just (BookSelectorDetail.initialModel session session.token model.searchbooks searchbook)
                  } 
                , Cmd.none )


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
    div []
        [ viewBookSearcher False model
        , viewBooks model.searchbooks
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
            ]
            , case disabled of
                False ->
                    Button.button
                        [ Button.primary, Button.attrs [ class "float-right" ], Button.onClick DoSearch ]
                        [ text "Search" ]
                                        
                True ->
                    div [] []
                                        
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
            h3 [] [ text "Not asked..." ]

        RemoteData.Loading ->
            h3 [] [ text "Loading..." ]

        RemoteData.Success actualSearchBooks ->
            viewBookTiles actualSearchBooks
                
        RemoteData.Failure httpError ->
            viewFetchError (buildErrorMessage httpError)


viewBookTiles : SearchBooks -> Html Msg
viewBookTiles searchbooks =
    div [ class "row" ]
        ( List.map viewBookTilesCard searchbooks.searchBookList )
                

viewBookTilesCard : SearchBook -> Html Msg
viewBookTilesCard searchbook =
    div [ class "col-sm-6 col-lg-4", onClick (ClickedBookDetail searchbook) ]
    [
    Card.config [ Card.attrs [ style "width" "20rem", style "height" "35rem"  ]  ]
        |> Card.block [] 
            [ Block.titleH6 [ ] [ text searchbook.title ]
            , Block.custom <| img [ src searchbook.smallThumbnail, Display.inlineBlock, style "width" "12rem" ] []
            , Block.text [ class "text-muted small" ] [ text searchbook.description ]
            , Block.titleH6 [] [ text searchbook.authors ]
            , Block.text [] [ text ("Published " ++ searchbook.publishedDate) ]
            , Block.text [] [ text ("Language " ++ searchbook.language) ]
            ]
        |> Card.view
    ]

