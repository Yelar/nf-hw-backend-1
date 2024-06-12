import { CreateEventDto } from './dtos/CreateEvent.dot';
import { Event } from './types/response';
import mongoose from 'mongoose';
import EventModel, {IEvent} from './models/Event';


// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
    async getEventById(id: string): Promise<Event | IEvent | null> {
      return EventModel.findById(id).exec();
    }
    async getEvents(): Promise<(Event | IEvent)[]> {
      return EventModel.find().exec();
    }
  
    async createEvent(userDto: CreateEventDto): Promise<Event | IEvent> {
        const newEvent = new EventModel ({
            name: userDto.name,
            description: userDto.description,
            date: new Date(userDto.date),
            location: userDto.location,
            duration: userDto.duration, 
    });
        await newEvent.save();
        return newEvent;
    }
  }
  
  export default EventService;
  