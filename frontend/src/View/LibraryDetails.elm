module View.LibraryDetails exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http
-- import OAuth

import RemoteData exposing (WebData)
import Array exposing (Array)

import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Form.Select as Select
import Bootstrap.Button as Button
import OAuth

import Domain.Book exposing (..)
import Domain.Checkout exposing (..)
import Domain.SearchBook exposing (..)
import Domain.LibraryBook exposing (..)
import Session exposing (..)
import Utils exposing (..)
import Regex



type alias Config msg a =
    { userEmail : String
    , doCheckout : msg
    , doCheckin : msg
    , doPrevious : msg
    , doNext : msg
    , doCancel : msg
    , maybeBook : Maybe (Book a)
    , maybeCheckout : Maybe Checkout
    , hasPrevious : Bool
    , hasNext : Bool
    , doActionPrepare : Bool
    }

type Status =
    Details
    | AddToLibrary

-- #####
-- #####   VIEW
-- #####


view : Config msg a -> Html msg
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


viewBookDetail : Config msg a -> Html msg
viewBookDetail config =
    let
        { maybeBook } = config
    in
        case maybeBook of
            Just book ->
                div [ class "container" ]
                    [
                        Form.form []
                        [ Form.group []
                            [ Form.label [ ] [ text "Title"]
                            , Input.text [ Input.value book.title, Input.disabled True ]
                            ]
                        , Form.group []
                            [ Form.label [ ] [ text "Author(s)"]
                            , Input.text [ Input.value book.authors, Input.disabled True ]
                            ]
                        , Form.group []
                            [ Form.label [ ] [ text "Description"]
                            , Textarea.textarea [ Textarea.rows 5, Textarea.value book.description, Textarea.disabled ]
                            ]
                        , Form.group []
                            [ Form.label [ ] [ text "Published date"]
                            , Input.text [ Input.value book.publishedDate, Input.disabled True ]
                            ]
                        , Form.group []
                            [ Form.label [ ] [ text "Language"]
                            , Input.text [ Input.value (lookup book.language languages), Input.disabled True ]
                            ]
                        , Form.group []
                            [ Form.label [ ] [ text "Location"]
                            , Input.text [ Input.value (lookup book.location locations), Input.disabled True ]
                            ]
                        , Form.group []
                            [ Form.label [ ] [ text "Owner"]
                            , Input.text [ Input.value book.owner, Input.disabled True ]
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
                        , viewBookDetailButtons config
                        ]
                    ]
            Nothing ->
                div [ class "container" ]
                    [ text "Oeps : BookDetails.elm config.book = Nothing" ]


viewBookDetailButtons : Config msg a -> Html msg
viewBookDetailButtons config =
    case ( config.maybeCheckout, config.doActionPrepare ) of

        ( Just checkout, False ) ->  -- Checkin, prepare
            let
                a = Debug.log  "viewBookDetailButtons checkout = "  checkout
            in
            
            if checkout.userEmail == config.userEmail then
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
                                , Table.td [] 
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doCheckin ]
                                        [ text "Check in" ]
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
                                        [ Form.label [ ] [ text ("You checked this book out at " ++ (getNiceTime checkout.dateTimeFrom) ++ ".") ]
                                        ]
                                    ]
                                ]
                            ]
                        )
                    ]

            else                    -- NOT Authorized to Check in
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
                                , Table.td [] 
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ ], Button.disabled True ]
                                        [ text "Check out" ]
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
                                        [ Form.label [ ] [ text (checkout.userEmail ++  " checked this book out at " ++ (getNiceTime checkout.dateTimeFrom) ++ ".") ]
                                        ]
                                    ]
                                ]
                            ]
                        )
                    ]

        ( Just checkout, True ) ->  -- Checkin, Confirm
            Form.group []
                [ Table.simpleTable
                    ( Table.thead [] [] 
                    , Table.tbody []
                        [ Table.tr []
                                [ Table.td [] 
                                    [ Button.button
                                        [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doPrevious, Button.disabled True ]
                                        [ text "<" ]
                                    ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineSecondary, Button.attrs [ ], Button.onClick config.doCancel ]
                                    [ text "Cancel" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doCheckin ]
                                    [ text "Confirm check in" ]
                                ]
                                , Table.td [] 
                                    [ Button.button
                                        [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doNext, Button.disabled True ]
                                        [ text ">" ]
                                    ]
                            ]
                        , Table.tr [] 
                            [ Table.td [ Table.cellAttr (colspan 4) ] 
                                [ Form.group []
                                    [ Form.label [ ] [ text ("Checked in by " ++ config.userEmail ++ "." ) ]
                                    ]
                                ]
                            ]
                        ]
                    )
                ]

        ( Nothing, False ) ->                   -- Checkout, prepare
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
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doCheckout ]
                                    [ text "Check out" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doNext, not(config.hasNext) |> Button.disabled ]
                                    [ text ">" ]
                                ]
                            ]
                        ]
                    )
                ]

        ( Nothing, True ) ->                   -- Checkout, confirm
            Form.group []
                [ Table.simpleTable
                    ( Table.thead [] [] 
                    , Table.tbody []
                        [ Table.tr []
                            [ Table.td [] 
                                [ Button.button
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doPrevious, Button.disabled True ]
                                    [ text "<" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineSecondary, Button.attrs [ ], Button.onClick config.doCancel ]
                                    [ text "Cancel" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlinePrimary, Button.attrs [ ], Button.onClick config.doCheckout ]
                                    [ text "Confirm check out" ]
                                ]
                            , Table.td [] 
                                [ Button.button
                                    [ Button.outlineInfo, Button.attrs [ ], Button.onClick config.doNext, Button.disabled True ]
                                    [ text ">" ]
                                ]
                            ]
                        , Table.tr [] 
                            [ Table.td [ Table.cellAttr (colspan 4) ] 
                                [ Form.group []
                                    [ Form.label [ ] [ text ("Checked out by " ++ config.userEmail ++ "." ) ]
                                    ]
                                ]
                            ]
                        ]
                    )
                ]

model2LibraryBook : Book a -> LibraryBook
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
