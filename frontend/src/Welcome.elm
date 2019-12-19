module Welcome exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Http as Http

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
import Bootstrap.Badge as Badge
import RemoteData exposing (RemoteData, WebData, succeed)

import Debug as Debug

import Utils exposing (buildErrorMessage)
import Session exposing (..)
import Domain.User exposing (..)

type Msg = ChangedPage Page


view : Session -> Html Msg
view session =
    case ( session.token, session.user ) of
        ( Nothing, _ ) ->
             div [ class "container" ]
                [ h1 [] [ text "Welcome" ]
                , p [] 
                    [ text "Welcome to the Lunatech's Library App."
                    , br [] []
                    , text "Browse interesting books. Books that you can borrow from your colleagues."
                    ]
                , p [] 
                    [ text "And maybe you have some books at home that are interesting for others..."
                    , br [] []
                    , div [ onClick (ChangedPage LoginPage), class "linktext"  ] [ text "Please login and take a look." ] 
                    ]
                ]

        ( Just token, RemoteData.Success user ) ->
             div [ class "container" ]
                [ h1 [] [ text ("Welcome") ]
                , p [] 
                    [ text ("Hi " ++ user.name ++ ", welcome to the Lunatech's Library App.")
                    , br [] []
                    , div [ onClick (ChangedPage LibraryPage), class "linktext"  ] 
                        [ text "Now you can browse interesting books in the library. Books that you can borrow from your colleagues." ]
                    ]
                , p [] 
                    [ div [ onClick (ChangedPage BookSelectorPage), class "linktext"  ] 
                        [ text "Or add some books to the library that are interesting for others..." ]
                    ]
                , case session.message of
                    Session.Succeeded message ->
                        p [ class "text-success" ] 
                        [ div [] [ text  message ] ]
            
                    Session.Warning message ->
                        p [ class "text-warning" ] 
                        [ div [] [ text message ] ]

                    Session.Error message ->
                        p [ class "text-danger" ] 
                        [ div [] [ text message ] ]

                    Session.Empty ->
                        p []
                        []

                ]

        ( Just token, RemoteData.Failure httpError ) ->
            div [ class "container" ]
                [ p [ class "text-danger" ] [ text (buildErrorMessage httpError) ] ]

        ( _ , _ ) ->
            div [ class "container" ]
                [ p [ class "text-danger" ] [ text "Something went wrong here." ] ]


update : Msg -> Session -> ( Session, Cmd Msg )
update msg session =
    case msg of
        ChangedPage page ->
            ( changedPageSession page session, Cmd.none )

