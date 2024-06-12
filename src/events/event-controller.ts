import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';


class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }


    getEvents = async (req:Request, res:Response) =>{
        try{
            const {limit, page} = req.query;
            console.log(limit, page);
            
            const events = await this.eventService.getEvents(Number(limit), Number(page));
            const count =  events.length;
            res.status(200).json({
                events, 
                totalPages: Math.ceil(count / Number(limit)),
                currentPage: page,
            });
        }catch (error: any) {
            res.status(500).json({ error: error.message });
          }
    }

    getEventById = async (req:Request, res:Response) =>{
        try{
            const params = req.params;
            const {id} = params;
            const event = await this.eventService.getEventById(id);
            if(!event){
                res.status(404).json({error:"Event not found"});
            }else{
                res.status(200).json(event);
            }
        }catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    
}

export default EventController;