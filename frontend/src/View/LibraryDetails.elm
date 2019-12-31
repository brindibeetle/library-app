module View.LibraryDetails exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)


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
    { userEmail : String
    , doAction1 : { msg : msg, text : String, disabled : Bool, visible : Bool }
    , doAction2 : { msg : msg, text : String, disabled : Bool, visible : Bool }
    , remarks : String
    , doPrevious : msg
    , doNext : msg
    , doCancel : msg
    , libraryBook : LibraryBook
    , maybeCheckout : Maybe Checkout
    , hasPrevious : Bool
    , hasNext : Bool
    }

type Status =
    Details
    | AddToLibrary

-- #####
-- #####   VIEW
-- #####


view : Config msg -> Html msg
view config =
    viewBookDetail config
            
        -- AddToLibrary ->
            -- viewBookAddLibrary config
            


selectitem : (String) -> (String, String) -> Select.Item msg
selectitem valueSelected (value1, text1) =
    case valueSelected == value1 of
        True ->
            Select.item [ selected True, value value1 ] [ text text1 ] 

        False ->
            Select.item [ value value1 ] [ text text1 ] 


viewBookDetail : Config msg -> Html msg
viewBookDetail config =
    let
        { libraryBook } = config
    in
        div [ class "container" ]
            [
                Form.form []
                [ Form.group []
                    [ Form.label [ ] [ text "Title"]
                    , Input.text [ Input.value libraryBook.title, Input.disabled True ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Author(s)"]
                    , Input.text [ Input.value libraryBook.authors, Input.disabled True ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Description"]
                    , Textarea.textarea [ Textarea.rows 5, Textarea.value libraryBook.description, Textarea.disabled ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Published date"]
                    , Input.text [ Input.value libraryBook.publishedDate, Input.disabled True ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Language"]
                    , Input.text [ Input.value (lookup libraryBook.language languages), Input.disabled True ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Location"]
                    , Input.text [ Input.value (lookup libraryBook.location locations), Input.disabled True ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Owner"]
                    , Input.text [ Input.value libraryBook.owner, Input.disabled True ]
                    ]
                , Form.group []
                    [ Form.label [ ] [ text "Image of the book"] 
                    , Table.simpleTable
                        ( Table.thead [] []
                        , Table.tbody []
                            [ Table.tr []
                            [ Table.td [] [ img [ src libraryBook.thumbnail ] [] ]
                            ]
                            ]
                        )
                    ]
                , viewBookDetailButtons config
                ]
            ]


viewBookDetailButtons : Config msg -> Html msg
viewBookDetailButtons config =
    Form.group []
        [ Table.simpleTable
            ( Table.thead [] [] 
            , Table.tbody []
                [ Table.tr []
                    [ Table.td [] 
                        [ Button.button
                            [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doPrevious, not(config.hasPrevious) |> Button.disabled ]
                            [ text "<" ]
                        ]
                    , Table.td [] 
                        [ Button.button
                            [ Button.outlineSecondary, Button.attrs [ ], Button.onClick config.doCancel ]
                            [ text "Cancel" ]
                        ]
                    , Table.td [ Table.cellAttr ( hidden (not config.doAction1.visible) ) ] 
                        [ Button.button
                            [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doAction1.msg, config.doAction1.disabled |> Button.disabled ]
                            [ text config.doAction1.text ]
                        ]
                    , Table.td [ Table.cellAttr ( hidden (not config.doAction2.visible) ) ] 
                        [ Button.button
                            [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doAction2.msg, config.doAction2.disabled |> Button.disabled ]
                            [ text config.doAction2.text ]
                        ]
                    , Table.td [] 
                        [ Button.button
                            [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doNext, not(config.hasNext) |> Button.disabled ]
                            [ text ">" ]
                        ]
                    ]
                , Table.tr [] 
                    [ Table.td [ Table.cellAttr (colspan 4) ] 
                        [ Form.group []
                            [ Form.label [ ] [ text config.remarks ]
                            ]
                        ]
                    ]
                ]
            )
        ]


model2LibraryBook : LibraryBook -> LibraryBook
model2LibraryBook book =
    {
        id = 0
        , title = book.title
        , authors = book.authors
        , description = book.description
        , publishedDate = book.publishedDate
        , language = book.language
        , smallThumbnail = book.smallThumbnail
        , thumbnail = book.thumbnail
        , owner = book.owner
        , location = book.location
    }



           

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
