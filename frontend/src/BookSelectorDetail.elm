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
import Constants exposing (..)

type alias Model = 
    {
        searchbooks : SearchBooks
        , index : Int
        , title : String
        , authors : String
        , description : String
        , publishedDate : String
        , language : String
        , owner : String
        , location : String
        , smallThumbnail : String
        , thumbnail : String

        , titleError : String
        , authorsError : String
        , descriptionError : String
        , publishedDateError : String
        , languageError : String
        , ownerError : String
        , locationError : String

        , status : Status
    }

type Status =
    Details
    | AddToLibrary

initialModel : SearchBooks -> Int -> Model
initialModel searchbooks index =
    let
        searchbook = SearchBook.get index searchbooks 
    in
        { searchbooks = searchbooks
        , index = index
        , title = searchbook.title
        , authors = searchbook.authors
        , description = searchbook.description
        , publishedDate = searchbook.publishedDate
        , language = searchbook.language
        , owner = ""
        , location = ""
        , smallThumbnail = searchbook.smallThumbnail
        , thumbnail = searchbook.thumbnail

        , titleError = ""
        , authorsError = ""
        , descriptionError = ""
        , publishedDateError = ""
        , languageError = ""
        , ownerError = ""
        , locationError = ""
        , status = Details
        }


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    case model.status of
        Details ->
            viewBookDetail model
            
        AddToLibrary ->
            viewBookAddLibrary model
            


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
            [ Form.group []
                [ Form.label [ ] [ text "Title"]
                , Input.text [ Input.id "title", Input.onInput UpdateTitle, Input.value model.title, Input.disabled True ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "authors", Input.onInput UpdateAuthors, Input.value model.authors, Input.disabled True ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Description"]
                , Textarea.textarea [ Textarea.id "description", Textarea.rows 5, Textarea.onInput UpdateDescription, Textarea.value model.description, Textarea.disabled ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Published date"]
                , Input.text [ Input.id "publishedDate", Input.onInput UpdatePublishedDate, Input.value model.publishedDate, Input.disabled True ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Language"]
                , Select.select [ Select.id "language", Select.onChange UpdateLanguage, Select.disabled True ]
                    ( List.map (selectitem model.language) languages )
                ]
            , Form.group []
                [ Form.label [ ] [ text "Owner of the book"]
                , Input.text [ Input.id "owner", Input.onInput UpdateOwner, Input.value model.owner, Input.disabled True ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Location of the book"]
                , Select.select [ Select.id "location", Select.onChange UpdateLocation, Select.disabled True ]
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
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick DoPrevious, not(SearchBook.hasPrevious model.searchbooks model.index) |> Button.disabled ]
                                    [ text "<" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineSecondary, Button.attrs [ ], Button.onClick DoCancel ]
                                    [ text "Cancel" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlinePrimary, Button.attrs [ ], Button.onClick DoAddToLibrary ]
                                    [ text "Add to library" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick DoNext, not(SearchBook.hasNext model.searchbooks model.index) |> Button.disabled ]
                                    [ text ">" ]
                                ]
                            ]
                        ]
                    )
                ]
            ]
        ]

viewBookAddLibrary : Model -> Html Msg
viewBookAddLibrary model =
    let
        titleInputFeedback = checkTitle "title" model.title
        authorsInputFeedback = checkAuthors "author(s)" model.authors
        descriptionInputFeedback = checkDescription "description" model.description
        publishedDateInputFeedback = checkPublishedDate "publishedDate" model.publishedDate
        languageInputFeedback = checkPublishedDate "language" model.language
        ownerInputFeedback = checkPublishedDate "owner" model.owner
        locationInputFeedback = checkPublishedDate "location" model.location
        allOk = titleInputFeedback == "" && authorsInputFeedback == "" && descriptionInputFeedback == ""
            && publishedDateInputFeedback == "" && languageInputFeedback == "" && ownerInputFeedback == ""
            && locationInputFeedback == ""
    in
    div [ class "container" ]
        [
            Form.form []
            [ Form.group []
                [ Form.label [ ] [ text "Title"]
                , Input.text [ Input.id "title", Input.onInput UpdateTitle, Input.value model.title
                    , if titleInputFeedback == "" then Input.success else Input.danger ]
                , Form.invalidFeedback [] [ text titleInputFeedback ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Author(s)"]
                , Input.text [ Input.id "authors", Input.onInput UpdateAuthors, Input.value model.authors
                    , if authorsInputFeedback == "" then Input.success else Input.danger ]
                , Form.invalidFeedback [] [ text authorsInputFeedback ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Description"]
                , Textarea.textarea [ Textarea.id "description", Textarea.rows 5, Textarea.onInput UpdateDescription, Textarea.value model.description
                    , if descriptionInputFeedback == "" then Textarea.success else Textarea.danger ]
                , Form.invalidFeedback [] [ text descriptionInputFeedback ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Published date"]
                , Input.text [ Input.id "publishedDate", Input.onInput UpdatePublishedDate, Input.value model.publishedDate
                    , if publishedDateInputFeedback == "" then Input.success else Input.danger ]
                , Form.invalidFeedback [] [ text publishedDateInputFeedback ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Language"]
                , Select.select [ Select.id "language", Select.onChange UpdateLanguage
                    , if languageInputFeedback == "" then Select.success else Select.danger ]
                    ( List.map (selectitem model.language) languages )
                , Form.invalidFeedback [] [ text languageInputFeedback ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Owner of the book"]
                , Input.text [ Input.id "owner", Input.onInput UpdateOwner, Input.value model.owner
                    , if ownerInputFeedback == "" then Input.success else Input.danger ]
                , Form.invalidFeedback [] [ text ownerInputFeedback ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Location of the book"]
                , Select.select [ Select.id "location", Select.onChange UpdateLocation
                    , if locationInputFeedback == "" then Select.success else Select.danger ]
                    ( List.map (selectitem model.location) locations )
                , Form.invalidFeedback [] [ text locationInputFeedback ]
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
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick DoPrevious, not(SearchBook.hasPrevious model.searchbooks model.index) |> Button.disabled ]
                                    [ text "<" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineSecondary, Button.attrs [ ], Button.onClick DoCancelAddToLibrary ]
                                    [ text "Cancel" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlinePrimary, Button.attrs [ ], Button.onClick DoLibraryBookInsert, not(allOk) |> Button.disabled  ]
                                    [ text "Add to library" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick DoNext, not(SearchBook.hasNext model.searchbooks model.index) |> Button.disabled ]
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
        , publishedDate = model.publishedDate
        , language = model.language
        , smallThumbnail = model.smallThumbnail
        , thumbnail = model.thumbnail
        , owner = model.owner
        , location = model.location
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

           

checkTitle : String -> String -> String
checkTitle label value = 
    isObligatory label value


checkAuthors : String -> String -> String
checkAuthors label value = 
    isObligatory label value


checkDescription : String -> String -> String
checkDescription label value = 
    isObligatory label value


checkPublishedDate : String -> String -> String
checkPublishedDate label value = 
    isObligatory label value

checkLanguage : String -> String -> String
checkLanguage label value = ""

checkOwner : String -> String -> String
checkOwner label value = ""

checkLocation : String -> String -> String
checkLocation label value =  ""


isObligatory : String -> String -> String
isObligatory label value =
    case value of
        "" -> 
            "Field \"" ++ label ++ "\" needs a value here."

        _ ->
            ""
            


-- #####
-- #####   UPDATE
-- #####


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
        | LibraryBookInserted (Result Http.Error LibraryBook)
        | DoCancel
        | DoPrevious
        | DoNext
        | DoCancelAddToLibrary
        | DoAddToLibrary


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdateTitle title ->
            { model = { model | title = title }
            , session = session
            , cmd = Cmd.none }

        UpdateAuthors authors ->
            { model = { model | authors = authors }
            , session = session
            , cmd = Cmd.none }
            
        UpdateDescription description ->
            { model = { model | description = description }
            , session = session
            , cmd = Cmd.none }

        UpdateLanguage language ->
            { model = { model | language = language }
            , session = session
            , cmd = Cmd.none }

        UpdatePublishedDate publishedDate ->
            { model = { model | publishedDate = publishedDate }
            , session = session
            , cmd = Cmd.none }

        UpdateOwner owner ->
            { model = { model | owner = owner }
            , session = session
            , cmd = Cmd.none }

        UpdateLocation location ->
            { model = { model | location = location }
            , session = session
            , cmd = Cmd.none }

        DoLibraryBookInsert ->
            case session.token of
                Just token ->
                    let
                        libraryAppApiCmd = Debug.log " oLibraryBookInsert -> "
                            insertBook token (model2LibraryBook model)
                    in
                        { model = model, session = session, cmd = libraryAppApiCmd }
                Nothing ->
                        { model = model, session = session, cmd = Cmd.none }

        LibraryBookInserted (Result.Err err) ->
            { model = model
            , session = { session 
                | message = Error ("LibraryBookInserted Result.Err error : " ++ buildErrorMessage err)
                }
            , cmd = Cmd.none }
                
        LibraryBookInserted (Result.Ok libraryBookInserted) ->
            { model = model
            , session = { session 
                | message = Succeeded ("The book \"" ++ model.title ++ "\" has been added to the library!")
                }
            , cmd = Cmd.none }
 
        DoCancel ->
            { model = model
            , session = changedPageSession BookSelectorPage session
            , cmd = Cmd.none}

        DoPrevious ->
            { model = initialModel model.searchbooks (model.index - 1)
            , session = session
            , cmd = Cmd.none}

        DoNext ->
            { model = initialModel model.searchbooks (model.index + 1)
            , session = session
            , cmd = Cmd.none}

        DoCancelAddToLibrary ->
            { model = { model
                | status = AddToLibrary 
                }
            , session = session
            , cmd = Cmd.none}

        DoAddToLibrary ->
            { model = { model
                | status = Details 
                }
            , session = session
            , cmd = Cmd.none}


-- #####
-- #####   UTILS
-- #####

