import { Container, Nav, Navbar, NavDropdown, Form, Button } from "react-bootstrap"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/router';
import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
    const router = useRouter();
    const [searchField, setSearchField] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

    let token = readToken();

    async function submitForm(e) {
        // prevent the browser from automatically submitting the form
        e.preventDefault();

        // Close navigation bar in mobile mode 
        setIsExpanded(false)

        // Clean search textField data
        document.getElementById('searchTextField').value = ""

        setSearchHistory(await addToHistory(`title=true&q=${searchField}`))

        console.log(`form submitted - searchField: ${searchField}`);
        router.push(`/artwork?title=true&q=${searchField}`)
    }

    function logout() {
        setIsExpanded(false)
        removeToken();
        router.push('/');
    }

    return (
        <>
            <Navbar expand="lg" className="fixed-top navbar-dark bg-dark" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand>Kairan Zhai</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsExpanded(!isExpanded)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>Home</Nav.Link></Link>
                            {token && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>Advanced Search</Nav.Link></Link>}
                        </Nav>
                        {!token && 
                        <Nav>
                            <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>Login</Nav.Link></Link>
                            <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>Register</Nav.Link></Link>
                        </Nav>}
                        &nbsp
                        {token && <Form className="d-flex" onSubmit={submitForm}>
                            <Form.Control
                                id="searchTextField"
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => setSearchField(e.target.value)}
                            />
                            <Button variant="success" type="submit">Search</Button>
                        </Form>}
                        {token && <Nav>
                            <NavDropdown title={token.userName} id="basic-nav-dropdown">
                                <Link href="/favourites" passHref legacyBehavior ><NavDropdown.Item onClick={() => setIsExpanded(false)}>Favourites</NavDropdown.Item></Link>
                                <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={() => setIsExpanded(false)}>Search History</NavDropdown.Item></Link>
                                <NavDropdown.Item  onClick={() => logout()}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>}
                        
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <br />
        </>
    )
}