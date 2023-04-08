import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { useRouter } from "next/router";
import { Card, ListGroup, Button } from "react-bootstrap";
import styles from '@/styles/History.module.css';
import { removeFromHistory } from "@/lib/userData";

export default function SearchHistory() {
    const router = useRouter();
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

    let parsedHistory = [];

    if(searchHistory){
        searchHistory.map((h) => {
            let params = new URLSearchParams(h);
            let entries = params.entries();
            parsedHistory.push(Object.fromEntries(entries));
        })
    }
    
    function historyClicked(e, index) {
        // prevent the browser from automatically submitting the form
        e.preventDefault();

        router.push(`/artwork?${searchHistory[index]}`)
    }

    async function removeHistoryClicked(e, index) {
        // stop the event from trigging other events
        e.stopPropagation();

        setSearchHistory(await removeFromHistory(searchHistory[index])) 
    }

    if(!searchHistory) return null;

    return <>
        {parsedHistory.length == 0
            ? <Card>
                <Card.Body>
                    <Card.Title>Nothing here</Card.Title>
                    <Card.Text>
                        Try searching for some artwork
                    </Card.Text>
                </Card.Body>
            </Card>
            : <ListGroup>
                {parsedHistory.map((historyItem, index) => 
                    <ListGroup.Item key={index} className={styles.historyListItem} onClick={(e) => historyClicked(e, index)}>{Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}<Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button></ListGroup.Item>)
                    
                }
            </ListGroup>
        }
    </>
}