import { useAtom } from "jotai"
import { favouritesAtom } from '@/store';
import { Row, Col, Card } from "react-bootstrap"
import ArtworkCard from "@/components/ArtworkCard";

export default function Favourites() {
    const [favourites, setFavourites] = useAtom(favouritesAtom)

    if(!favourites) return null;

    return (
        <Row>
            {favourites.length > 0
                ? favourites.map((id) => <Col lg={3} key={id}><ArtworkCard objectID={id} /></Col>)
                : <Card>
                    <Card.Body>
                        <Card.Title>Nothing here</Card.Title>
                        <Card.Text>
                            Try searching for some artwork
                        </Card.Text>
                    </Card.Body>
                </Card>
            }
        </Row>
    )
}