module Page exposing (..)

type Page
    = LandingPage
    | BookSelectorPage 
    | LoginPage
    | BookSelectorDetailPage


toString : Page -> String
toString page =
    case page of
        LandingPage ->
            "NotFoundPage"

        BookSelectorPage ->
            "BookSelectorPage"

        LoginPage ->
            "LoginPage"

        BookSelectorDetailPage ->
            "BookSelectorDetailPage"
    