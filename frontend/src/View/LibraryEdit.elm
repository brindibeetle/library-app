module View.LibraryEdit exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
-- import OAuth

import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Select as Select
import Bootstrap.Button as Button

import Domain.Checkout exposing (..)
-- import Domain.SearchBook exposing (..)
import Domain.LibraryBook as LibraryBook exposing (..)
import Session exposing (..)
import Utils exposing (..)
import Regex
import Http


type alias Config =
    { book : LibraryBook
    , doInsert : { visible : Bool }
    , doUpdate : { visible : Bool }
    }


-- #####
-- #####   VIEW
-- #####


view : Config -> Html Msg
view config =
    viewBookDetail config
            
        -- AddToLibrary ->
            -- viewBookAddLibrary config
            


viewBookDetail : Config -> Html Msg
viewBookDetail config =
    let
        { book } = config
    in
        let
            titleInputFeedback = checkTitle "title" book.title
            authorsInputFeedback = checkAuthors "author(s)" book.authors
            descriptionInputFeedback = checkDescription "description" book.description
            publishedDateInputFeedback = checkPublishedDate "publishedDate" book.publishedDate
            languageInputFeedback = checkLanguage "language" book.language
            ownerInputFeedback = checkOwner "owner" book.owner
            locationInputFeedback = checkLocation "location" book.location
            allOk = titleInputFeedback == "" && authorsInputFeedback == "" && descriptionInputFeedback == ""
                && publishedDateInputFeedback == "" && languageInputFeedback == "" && ownerInputFeedback == ""
                && locationInputFeedback == ""
        in
        div [ class "container" ]
            [
                Form.form []
                [ Form.group []
                    [ Form.label [ ] [ text "Title"]
                    , Input.text [ Input.id "title", Input.onInput UpdateTitle, Input.value book.title
                        , if titleInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text titleInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Author(s)"]
                    , Input.text [ Input.id "authors", Input.onInput UpdateAuthors, Input.value book.authors
                        , if authorsInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text authorsInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Description"]
                    , Textarea.textarea [ Textarea.id "description", Textarea.rows 5, Textarea.onInput UpdateDescription, Textarea.value book.description
                        , if descriptionInputFeedback == "" then Textarea.success else Textarea.danger ]
                    , Form.invalidFeedback [] [ text descriptionInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Published date"]
                    , Input.text [ Input.id "publishedDate", Input.onInput UpdatePublishedDate, Input.value book.publishedDate
                        , if publishedDateInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text publishedDateInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Language"]
                    , Select.select [ Select.id "language", Select.onChange UpdateLanguage
                        , if languageInputFeedback == "" then Select.success else Select.danger ]
                        ( List.map (selectitem book.language) languages )
                    , Form.invalidFeedback [] [ text languageInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Owner of the book"]
                    , Input.email [ Input.id "owner", Input.onInput UpdateOwner, Input.value book.owner
                        , if ownerInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text ownerInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Location of the book"]
                    , Select.select [ Select.id "location", Select.onChange UpdateLocation
                        , if locationInputFeedback == "" then Select.success else Select.danger ]
                        ( List.map (selectitem book.location) locations )
                    , Form.invalidFeedback [] [ text locationInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Image of the book"] 
                    , Table.simpleTable
                        ( Table.thead [] []
                        , Table.tbody []
                            [ Table.tr []
                            [ Table.td [] [ img [ src book.thumbnail ] [] ]
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
                                        [ Button.outlineInfo, Button.attrs [ ], Button.disabled True ]
                                        [ text "<" ]
                                    ]
                                , Table.td [] 
                                    [ Button.button
                                        [ Button.outlineSecondary, Button.attrs [ ], Button.onClick DoCancel ]
                                        [ text "Cancel" ]
                                    ]
                                , Table.td [ Table.cellAttr ( hidden (not config.doInsert.visible) ) ] 
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ ], Button.onClick DoInsert, not(allOk) |> Button.disabled  ]
                                        [ text "Insert" ]
                                    ]
                                , Table.td [ Table.cellAttr ( hidden (not config.doUpdate.visible) ) ] 
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ ], Button.onClick DoUpdate, not(allOk) |> Button.disabled  ]
                                        [ text "Update" ]
                                    ]
                                , Table.td [] 
                                    [ Button.button
                                        [ Button.outlineInfo, Button.attrs [ ], Button.disabled True ]
                                        [ text ">" ]
                                    ]
                                ]
                            ]
                        )
                    ]
                ]
            ]

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
checkLanguage label value = 
    isObligatory label value

checkOwner : String -> String -> String
checkOwner label value = 
    case Regex.fromString emailRegex of
        Just regex ->
            if Regex.contains regex value then
                ""
            else
                "Please enter a valid email address."
    
        Nothing ->
            ""

emailRegex : String
emailRegex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\""
    ++ "(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*"
    ++ "\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"
    ++ "\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"


checkLocation : String -> String -> String
checkLocation label value = 
    isObligatory label value


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


type Msg =
        UpdateTitle String
        | UpdateAuthors String
        | UpdateDescription String
        | UpdatePublishedDate String
        | UpdateLanguage String
        | UpdateOwner String
        | UpdateLocation String
        | DoInsert
        | DoInserted (Result Http.Error LibraryBook)
        | DoUpdate
        | DoUpdated (Result Http.Error String)
        | DoCancel


update : Msg -> Config -> Session -> { model : Config, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of

        UpdateTitle title ->
            let
                book = model.book
            in
                { model = { model | book = book |> setTitle title }, session = session, cmd = Cmd.none }

        UpdateAuthors authors ->
            let
                book = model.book
            in
                { model = { model | book = book |> setAuthors authors }, session = session, cmd = Cmd.none }

        UpdateDescription description ->
            let
                book = model.book
            in
                { model = { model | book = book |> setDescription description }, session = session, cmd = Cmd.none }

        UpdateLanguage language ->
            let
                book = model.book
            in
                { model = { model | book = book |> setLanguage language }, session = session, cmd = Cmd.none }

        UpdatePublishedDate publishedDate ->
            let
                book = model.book
            in
                { model = { model | book = book |> setPublishedDate publishedDate }, session = session, cmd = Cmd.none }

        UpdateOwner owner ->
            let
                book = model.book
            in
                { model = { model | book = book |> setOwner owner }, session = session, cmd = Cmd.none }

        UpdateLocation location ->
            let
                book = model.book
            in
                { model = { model | book = book |> setLocation location }, session = session, cmd = Cmd.none }

        DoInsert ->
            case session.token of
                Just token ->
                    let
                        libraryAppApiCmd = 
                            LibraryBook.insert DoInserted session token model.book
                    in
                        { model = model, session = session, cmd = libraryAppApiCmd }
                Nothing ->
                        { model = model, session = session, cmd = Cmd.none }

        DoUpdate ->
            case session.token of
                Just token ->
                    let
                        libraryAppApiCmd = 
                            LibraryBook.update DoUpdated session token model.book
                    in
                        { model = model, session = session, cmd = libraryAppApiCmd }
                Nothing ->
                        { model = model, session = session, cmd = Cmd.none }


        DoInserted (Result.Ok _) ->
            { model = model
            , session = Session.succeed session ("The book \"" ++ model.book.title ++ "\" has been added to the library!")
            , cmd = Cmd.none 
            }

        DoInserted (Result.Err err) ->
            { model = model
            , session = Session.fail session ("The book \"" ++ model.book.title ++ "\" has NOT been added to the library : " ++ buildErrorMessage err)
            , cmd = Cmd.none
            }

        DoUpdated (Result.Ok _) ->
            { model = model
            , session = Session.succeed session ("The book \"" ++ model.book.title ++ "\" has been updated in the library!")
            , cmd = Cmd.none 
            }

        DoUpdated (Result.Err err) ->
            { model = model
            , session = Session.fail session ("The book \"" ++ model.book.title ++ "\" has NOT been updated in the library : " ++ buildErrorMessage err)
            , cmd = Cmd.none
            }
                
        DoCancel ->
            { model = model, session = session, cmd = Cmd.none }


-- #####
-- #####   UTILS
-- #####


selectitem : (String) -> (String, String) -> Select.Item msg
selectitem valueSelected (value1, text1) =
    if valueSelected == value1
    then 
        Select.item [ selected True, value value1 ] [ text text1 ] 

    else
        Select.item [ value value1 ] [ text text1 ] 

