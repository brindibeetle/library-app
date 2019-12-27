module View.SelectorDetailsEdit exposing (..)

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
import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Session exposing (..)
import Utils exposing (..)
import Regex



type alias Config msg =
    { updateTitle :  String -> msg 
    , updateAuthors :  String -> msg 
    , updateDescription :  String -> msg 
    , updatePublishedDate :  String -> msg 
    , updateLanguage :  String -> msg
    , updateOwner : String -> msg
    , updateLocation : String -> msg
    , doAction : msg
    , textAction : String
    , doActionDisabled : Bool
    , doCancel : msg
    , book : LibraryBook
    }


-- #####
-- #####   VIEW
-- #####


view : Config msg -> Html msg
view config =
    viewBookDetail config
            
        -- AddToLibrary ->
            -- viewBookAddLibrary config
            


viewBookDetail : Config msg -> Html msg
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
                    , Input.text [ Input.id "title", Input.onInput config.updateTitle, Input.value book.title
                        , if titleInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text titleInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Author(s)"]
                    , Input.text [ Input.id "authors", Input.onInput config.updateAuthors, Input.value book.authors
                        , if authorsInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text authorsInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Description"]
                    , Textarea.textarea [ Textarea.id "description", Textarea.rows 5, Textarea.onInput config.updateDescription, Textarea.value book.description
                        , if descriptionInputFeedback == "" then Textarea.success else Textarea.danger ]
                    , Form.invalidFeedback [] [ text descriptionInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Published date"]
                    , Input.text [ Input.id "publishedDate", Input.onInput config.updatePublishedDate, Input.value book.publishedDate
                        , if publishedDateInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text publishedDateInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Language"]
                    , Select.select [ Select.id "language", Select.onChange config.updateLanguage
                        , if languageInputFeedback == "" then Select.success else Select.danger ]
                        ( List.map (selectitem book.language) languages )
                    , Form.invalidFeedback [] [ text languageInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Owner of the book"]
                    , Input.email [ Input.id "owner", Input.onInput config.updateOwner, Input.value book.owner
                        , if ownerInputFeedback == "" then Input.success else Input.danger ]
                    , Form.invalidFeedback [] [ text ownerInputFeedback ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Location of the book"]
                    , Select.select [ Select.id "location", Select.onChange config.updateLocation
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
                                        [ Button.outlineSecondary, Button.attrs [ ], Button.onClick config.doCancel ]
                                        [ text "Cancel" ]
                                    ]
                                , Table.td [] 
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doAction, not(allOk) |> Button.disabled  ]
                                        [ text "Add to library" ]
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
-- #####   UTILS
-- #####


actionHtmlCheckout : { maybeCheckout : Maybe Checkout, user : String } -> List (Html msg)
actionHtmlCheckout { maybeCheckout, user } = 
    case maybeCheckout of
        Just checkout ->
            [ Form.group []
                [ Form.label [ ] [ text "Checked out at"]
                , Input.text 
                    [ Input.value (getNiceTime checkout.dateTimeFrom), Input.disabled True
                    , Input.danger 
                    ]
                ]
            , Form.group []
                [ Form.label [ ] [ text "Checked out by"]
                , Input.text 
                    [ Input.value checkout.userEmail, Input.disabled True
                    , Input.danger 
                    ]
                ]
            ]

        Nothing ->
            [ Form.group []
                [ Form.label [ ] [ text "Checked out by"]
                , Input.text 
                    [ Input.id "checkoutUser", Input.value user, Input.disabled True
                    ]
                ]
            ]



selectitem : (String) -> (String, String) -> Select.Item msg
selectitem valueSelected (value1, text1) =
    case valueSelected == value1 of
        True ->
            Select.item [ selected True, value value1 ] [ text text1 ] 

        False ->
            Select.item [ value value1 ] [ text text1 ] 

