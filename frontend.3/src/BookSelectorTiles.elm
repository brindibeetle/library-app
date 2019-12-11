module BookSelectorTiles exposing (..)

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
import Bootstrap.Utilities.Display as Display
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Card.Block as Block

import SearchBook exposing (..)
import LibraryBook exposing (..)


type alias Model = 
    {
        searchbooks : WebData SearchBooks
        , searchbook : Maybe SearchBook
        , active : Bool
    }


initialModel : WebData SearchBooks -> Model
initialModel searchbooks =
    {
        searchbooks = searchbooks
        , searchbook = Nothing
        , active = True
    }


-- init : ( Model, Cmd Msg )
-- init =
--     ( initialModel
--     , Cmd.none
--     )

type Msg
    = 
    DoBookDetail SearchBook



update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DoBookDetail searchbook ->
            ( { model 
              | searchbook = Just searchbook
              , active = False
              }
            , Cmd.none)
            


-- VIEW
view : Model -> Html Msg
view model =
    -- viewBooks model.searchbooks
    case model.searchbooks of
        RemoteData.NotAsked ->
            h3 [] [ text "Not asked..." ]

        RemoteData.Loading ->
            h3 [] [ text "Loading..." ]

        RemoteData.Success actualSearchBooks ->
            viewBooks actualSearchBooks
                
        RemoteData.Failure httpError ->
            viewFetchError (buildErrorMessage httpError)


viewBooks : SearchBooks -> Html Msg
viewBooks searchbooks =
    div [ class "row" ]
        ( List.map viewBookCard searchbooks.searchBookList )
                

viewBookCard : SearchBook -> Html Msg
viewBookCard searchbook =
    div [ class "col-sm-6 col-lg-4", onClick (DoBookDetail searchbook) ]
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


viewFetchError : String -> Html Msg
viewFetchError error = 
    div []
        [ text error ]