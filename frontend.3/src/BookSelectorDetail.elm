module BookSelectorDetail exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http
-- import OAuth

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
import Bootstrap.Table as Table
import Bootstrap.Button as Button
import Bootstrap.Dropdown as Dropdown
import Bootstrap.Card as Card
import Bootstrap.Text as Text
import Bootstrap.Card.Block as Block
import OAuth

import SearchBook exposing (..)
import LibraryBook exposing (..)
import LibraryAppApi exposing (..)
import Session exposing (..)


type alias Model = 
    {
        session : Session
        , searchbooks : WebData SearchBooks
        , maybeToken : Maybe OAuth.Token
        , error : Maybe String
        , succeeded : Maybe String
        , active : Bool
        , title : String
        , authors : String
        , description : String
        , publishedDate : String
        , language : String
        , owner : String
        , location : String
        , smallThumbnail : String
        , thumbnail : String
    }


initialModel : Session -> Maybe OAuth.Token -> WebData SearchBooks -> SearchBook -> Model
initialModel session maybeToken searchbooks searchbook =
    { session = session
    , searchbooks = searchbooks
    , maybeToken = maybeToken
    , error = Nothing
    , succeeded = Nothing
    , active = True
    , title = searchbook.title
    , authors = searchbook.authors
    , description = searchbook.description
    , publishedDate = searchbook.publishedDate
    , language = searchbook.language
    , owner = ""
    , location = ""
    , smallThumbnail = searchbook.smallThumbnail
    , thumbnail = searchbook.thumbnail
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
        | DoLibraryBookInsert
        -- | LibraryAppApiMsg LibraryAppApi.Msg 
        | LibraryBookInserted (Result Http.Error LibraryBook)



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

        DoLibraryBookInsert ->
            case model.maybeToken of
                Just token ->
                    let
                        libraryAppApiCmd = Debug.log " oLibraryBookInsert -> "
                            insertBook token (model2LibraryBook model)
                    in
                        (model , libraryAppApiCmd )
                Nothing ->
                    ( model, Cmd.none )

        LibraryBookInserted result_error_item ->
          let
              result_error_item1 = Debug.log "LibraryAppApiMsg subMsg" result_error_item
          in
          
            case result_error_item of
                Result.Err err ->
                  ( { model 
                    | error = Just ("LibraryBookInserted Result.Err error : " ++ buildErrorMessage err)
                    }
                 , Cmd.none )
                
                Result.Ok libraryBookInserted ->
                  ( { model 
                    | succeeded = Just ("The book \"" ++ model.title ++ "\" has been added to the library!")
                    }
                 , Cmd.none )
 
-- VIEW
view : Model -> Html Msg
view model =
    viewBookDetail model


languages : List (String, String)
languages = [ ("en", "English"), ("nl", "Nederlands"), ("fr", "Français") ]

locations : List (String, String)
locations = [ ("am", "Amsterdam"), ("ro", "Rotterdam"), ("br", "Bruxelles"), ("ch", "Chessy") ]


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
            case ( model.error, model.succeeded ) of
                ( Just error, _ ) ->
                  text error

                ( _, Just succeeded ) ->
                  text succeeded

                ( Nothing, Nothing ) ->
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
                    , Form.group []
                        [ Form.label [ ] [ text "Image of the book"] 
                        , Table.simpleTable
                            ( Table.thead [] []
                            , Table.tbody []
                                [ Table.tr []
                                [ Table.td [] [ img [ src model.thumbnail ] [] ]
                                ]
                                ]
                            )
                        ]
                    , Form.group []
                        [ Table.simpleTable
                            ( Table.thead [] [] 
                            , Table.tbody []
                                [ Table.tr []
                                    [ Table.td [] 
                                        [ Button.button
                                            [ Button.outlineInfo, Button.attrs [ ], Button.onClick DoLibraryBookInsert ]
                                            [ text "<" ]
                                        ]
                                    , Table.td [] 
                                        [ Button.button
                                            [ Button.outlineSecondary, Button.attrs [ ], Button.onClick DoLibraryBookInsert ]
                                            [ text "Cancel" ]
                                        ]
                                    , Table.td [] 
                                        [ Button.button
                                            [ Button.outlinePrimary, Button.attrs [ ], Button.onClick DoLibraryBookInsert ]
                                            [ text "Add to library" ]
                                        ]
                                    , Table.td [] 
                                        [ Button.button
                                            [ Button.outlineInfo, Button.attrs [ ], Button.onClick DoLibraryBookInsert ]
                                            [ text ">" ]
                                        ]
                                    ]
                                ]
                            )
                        ]
                    ]
        ]


model2LibraryBook : Model -> LibraryBook
model2LibraryBook model =
    {
        id = 0
        , title = model.title
        , authors = model.authors
        , description = model.description
        -- , publishedDate = model.publishedDate
        -- , language = model.language
        -- , smallThumbnail = model.smallThumbnail
        -- , thumbnail = model.thumbnail
        -- , owner = model.owner
        -- , location = model.location
    }


insertBook : OAuth.Token -> LibraryBook -> Cmd Msg
insertBook token libraryBook =
    let
        -- librarybook1 = Debug.log "BookSelector.insertBook " libraryBook
        puretoken = String.dropLeft 7 (OAuth.tokenToString token) -- cutoff /Bearer /
        requestUrl = Debug.log "requestUrl" LibraryAppApi.libraryApiBooksUrl ++ "?access_token=" ++ puretoken
        -- requestUrl = Debug.log "requestUrl" LibraryAppApi.libraryApiBooksUrl
        jsonBody = Debug.log "jsonBody" (newLibraryBookEncoder libraryBook)
        printheaders = Debug.log "token" (OAuth.tokenToString token)
        headers = OAuth.useToken token []
        -- headers1 = Http.header
    in
        Http.post
            { url = requestUrl
            , body = Http.jsonBody (newLibraryBookEncoder libraryBook)
            , expect = Http.expectJson LibraryBookInserted libraryBookDecoder
            }
      --  Http.request
      --       { url = requestUrl
      --       , method = "post"
      --       , headers = [ 
      --           Http.header "Content-Type" "application/json"
      --           , Http.header "authorization" printheaders
      --           , Http.header "Origin" "http://elm-lang.org"
      --           , Http.header "Access-Control-Request-Method" "POST"
      --           , Http.header "Access-Control-Request-Headers" "X-Custom-Header"
      --           ]
      --       , body = Http.jsonBody (newLibraryBookEncoder libraryBook)
      --       , expect = Http.expectJson LibraryBookInserted libraryBookDecoder
      --       , timeout = Nothing
      --       , tracker = Nothing
      --       }

            
getBook : LibraryBook -> Cmd Msg
getBook libraryBook =
    let
        requestUrl = LibraryAppApi.libraryApiBooksUrl 
    in
        Http.get
            { url = requestUrl ++ "/4"
            , expect = Http.expectJson LibraryBookInserted libraryBookDecoder
            }

