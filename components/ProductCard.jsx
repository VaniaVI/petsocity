import { Button, Card } from 'react-bootstrap';
import { fmtCLP } from '@/lib/formatters.js'

export default function ProductCard({product}) {

    return(
        <Card style={{ width: '18rem' }} className="h-80">
            <div style={{ height: '300px'}} className='w-100 overflow-hidden'>
            <Card.Img 
            variant="top" 
            src={product.imagen} 
            className='w-100 h-100'
            style={{ objectFit: 'cover' }}
            />
            </div>
            <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Text><strong>{fmtCLP(product.precio)}</strong></Card.Text>
                <Button 
                href='../'
                variant="primary">
                    Ver detalle
                </Button>
            </Card.Body>
        </Card>
    );
}
