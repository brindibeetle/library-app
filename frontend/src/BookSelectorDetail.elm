module BookSelectorDetail exposing (..)

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
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Select as Select
import Bootstrap.Form.Checkbox as Checkbox
import Bootstrap.Form.Radio as Radio
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Card.Block as Block

import SearchBook exposing (..)
import LibraryBook exposing (..)


type alias Model = 
    {
        searchbooks : WebData SearchBooks
        , active : Bool
        , title : String
        , authors : String
        , description : String
        , publishedDate : String
        , language : String
        , owner : String
        , location : String
    }


initialModel : WebData SearchBooks -> SearchBook -> Model
initialModel searchbooks searchbook =
    { searchbooks = searchbooks
    , active = True
    , title = searchbook.title
    , authors = searchbook.authors
    , description = searchbook.description
    , publishedDate = searchbook.publishedDate
    , language = searchbook.language
    , owner = ""
    , location = ""
    -- , authors = searchbook.authors
    }


-- init : ( Model, Cmd Msg )
-- init =
--     ( initialModel
--     , Cmd.none
--     )


type Msg
    = 
        UpdateTitle String
        | UpdateAuthors String
        | UpdateDescription String
        | UpdatePublishedDate String
        | UpdateLanguage String
        | UpdateOwner String
        | UpdateLocation String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateTitle title ->
            ( { model 
            | title = title }
            , Cmd.none
            )
        UpdateAuthors authors ->
             ( { model 
            | authors = authors }
            , Cmd.none
            )
        UpdateDescription description ->
             ( { model 
            | description = description }
            , Cmd.none
            )
        UpdateLanguage language ->
             ( { model 
            | language = language }
            , Cmd.none
            )
        UpdatePublishedDate publishedDate ->
             ( { model 
            | publishedDate = publishedDate }
            , Cmd.none
            )
        UpdateOwner owner ->
             ( { model 
            | owner = owner }
            , Cmd.none
            )
        UpdateLocation location ->
             ( { model 
            | location = location }
            , Cmd.none
            )


-- VIEW
view : Model -> Html Msg
view model =
    viewBookDetail model


languages : List (String, String)
languages = [ ("en", "English"), ("nl", "Nederlands"), ("fr", "Français") ]

locations : List (String, String)
locations = [ ("amsterdam", "Amsterdam"), ("rotterdam", "Rotterdam"), ("br", "Bruxelles"), ("ch", "Chessy") ]


selectitem : (String) -> (String, String) -> Select.Item msg
selectitem valueSelected (value1, text1) =
    case valueSelected == value1 of
        True ->
            Select.item [ selected True, value value1 ] [ text text1 ] 

        False ->
            Select.item [ value value1 ] [ text text1 ] 


viewBookDetail : Model -> Html Msg
viewBookDetail model =
    div [ class "container" ]
        [
            Form.form []
            [ 
              Form.group []
                [ Form.label [ ] [ text "Title"]
                , Input.text [ Input.id "title", Input.onInput UpdateTitle, Input.value model.title ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "authors", Input.onInput UpdateAuthors, Input.value model.authors ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Description"]
                , Textarea.textarea [ Textarea.id "description", Textarea.rows 5, Textarea.onInput UpdateDescription, Textarea.value model.description ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Published date"]
                , Input.text [ Input.id "publishedDate", Input.onInput UpdatePublishedDate, Input.value model.publishedDate ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Language"]
                , Select.select [ Select.id "language", Select.onChange UpdateLanguage ]
                    ( List.map (selectitem model.language) languages )
                ]
              , Form.group []
                [ Form.label [ ] [ text "Owner of the book"]
                , Input.text [ Input.id "owner", Input.onInput UpdateOwner, Input.value model.owner ]
                ]
              , Form.group []
                [ Form.label [ ] [ text "Location of the book"]
                , Select.select [ Select.id "location", Select.onChange UpdateLocation ]
                    ( List.map (selectitem model.location) locations )
                ]
            ]
        ]


