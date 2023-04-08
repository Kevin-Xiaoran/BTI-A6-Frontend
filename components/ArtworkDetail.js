import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';
import { useEffect } from 'react';
import Error from 'next/error';

export default function ArtworkCardDetail(props) {
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null);
    const [favourites, setFavourites] = useAtom(favouritesAtom)
    const [showAdded, setShowAdded] = useState(false)

    useEffect(()=>{
        setShowAdded(favourites?.includes(props.objectID))
    }, [favourites])    

    async function favouritesClicked(){
        if(showAdded == true){
            setFavourites(await removeFromFavourites(props.objectID)) 
            setShowAdded(false)
        }else{
            setFavourites(await addToFavourites(props.objectID))
            setShowAdded(true)
        }
    }

    if (!data || typeof data === 'undefined') {
        return (
            null
        )
    } else {
        if (data.length == 0 || error) {
            return (
                <Error statusCode={404} />
            )
        } else {
            return (
                <Card>
                    {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} alt="https://via.placeholder.com/375x375.png?text=[+Not+Available+]" />}
                    <Card.Body>
                        <Card.Title>{(data.title && data.title != "") ? data.title : "N/A"}</Card.Title>
                        <Card.Text>
                            <div><strong>Date:</strong> {(data.objectDate && data.objectDate != "") ? data.objectDate : "N/A"}</div>
                            <div><strong>Classification:</strong> {(data.classification && data.classification != "") ? data.classification : "N/A"}</div>
                            <div><strong>Medium:</strong> {(data.medium && data.medium != "") ? data.medium : "N/A"}</div>
                            <br />
                            <br />
                            <div><strong>Artist:</strong> {(data.artistDisplayName && data.artistDisplayName != "") ? data.artistDisplayName : "N/A"} {(data.artistDisplayName && data.artistDisplayName != "") && <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >(wiki)</a>}</div>
                            <div><strong>Credit Line:</strong> {(data.creditLine && data.creditLine != "") ? data.creditLine : "N/A"}</div>
                            <div><strong>Dimensions:</strong> {(data.dimensions && data.dimensions != "") ? data.dimensions : "N/A"}</div>
                            <Button variant={showAdded ? "primary" : "outline-primary"} onClick={favouritesClicked}>{showAdded ? "+ Favourite (added)" : "+ Favourite"}</Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
        }
    }
}