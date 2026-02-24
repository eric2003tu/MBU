export type PropertyType = "rent" | "buy";
export type PropertyCategory = "residential" | "commercial";

export interface Property {
    id: string;
    title: string;
    price: number;
    priceLabel: string;
    location: string;
    city: string;
    type: PropertyType;
    category: PropertyCategory;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image: string;
    images: string[];
    description: string;
    amenities: string[];
    agent: {
        name: string;
        phone: string;
        email: string;
    };
    featured: boolean;
    createdAt: string;
}

export const properties: Property[] = [
    {
        id: "1",
        title: "Skyline Penthouse with Panoramic Views",
        price: 2500000,
        priceLabel: "$2,500,000",
        location: "Upper East Side",
        city: "New York",
        type: "buy",
        category: "residential",
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        image: "/images/property-1.jpg",
        images: ["/images/property-1.jpg"],
        description:
            "A stunning penthouse offering breathtaking panoramic views of the city skyline. Features floor-to-ceiling windows, premium finishes, a private terrace, and state-of-the-art smart home technology throughout.",
        amenities: ["Terrace", "Concierge", "Gym", "Pool", "Parking", "Smart Home"],
        agent: { name: "Sarah Mitchell", phone: "+1 555-0101", email: "sarah@estate.com" },
        featured: true,
        createdAt: "2026-02-15",
    },
    {
        id: "2",
        title: "Modern Family Home with Garden",
        price: 850000,
        priceLabel: "$850,000",
        location: "Westfield",
        city: "Los Angeles",
        type: "buy",
        category: "residential",
        bedrooms: 5,
        bathrooms: 3,
        area: 4100,
        image: "/images/property-2.jpg",
        images: ["/images/property-2.jpg"],
        description:
            "Spacious contemporary family home set on a beautifully landscaped lot. Open-concept living with a chef's kitchen, home office, and resort-style backyard with covered patio.",
        amenities: ["Garden", "Garage", "Home Office", "Patio", "Fireplace"],
        agent: { name: "James Chen", phone: "+1 555-0102", email: "james@estate.com" },
        featured: true,
        createdAt: "2026-02-10",
    },
    {
        id: "3",
        title: "Downtown Luxury Apartment",
        price: 3500,
        priceLabel: "$3,500/mo",
        location: "Financial District",
        city: "Chicago",
        type: "rent",
        category: "residential",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: "/images/property-3.jpg",
        images: ["/images/property-3.jpg"],
        description:
            "Elegant apartment in a prime downtown location. Enjoy modern amenities, 24-hour doorman, rooftop lounge, and easy access to dining and entertainment.",
        amenities: ["Doorman", "Rooftop", "Laundry", "Storage", "Bike Room"],
        agent: { name: "Maria Garcia", phone: "+1 555-0103", email: "maria@estate.com" },
        featured: true,
        createdAt: "2026-02-12",
    },
    {
        id: "4",
        title: "Beachfront Villa Paradise",
        price: 4200000,
        priceLabel: "$4,200,000",
        location: "Oceanfront Drive",
        city: "Miami",
        type: "buy",
        category: "residential",
        bedrooms: 6,
        bathrooms: 5,
        area: 5500,
        image: "/images/property-4.jpg",
        images: ["/images/property-4.jpg"],
        description:
            "An extraordinary beachfront estate with infinity pool, private beach access, and tropical landscaping. The epitome of luxury coastal living.",
        amenities: ["Pool", "Beach Access", "Wine Cellar", "Home Theater", "Spa"],
        agent: { name: "David Russo", phone: "+1 555-0104", email: "david@estate.com" },
        featured: true,
        createdAt: "2026-02-08",
    },
    {
        id: "5",
        title: "Premium Office Space",
        price: 8500,
        priceLabel: "$8,500/mo",
        location: "Business Park",
        city: "San Francisco",
        type: "rent",
        category: "commercial",
        bedrooms: 0,
        bathrooms: 2,
        area: 3000,
        image: "/images/property-5.jpg",
        images: ["/images/property-5.jpg"],
        description:
            "Class A office space in a prestigious business park. Open floor plan, conference rooms, fiber internet, and parking included.",
        amenities: ["Conference Rooms", "Parking", "Security", "Fiber Internet", "Cafe"],
        agent: { name: "Lisa Park", phone: "+1 555-0105", email: "lisa@estate.com" },
        featured: false,
        createdAt: "2026-02-14",
    },
    {
        id: "6",
        title: "Cozy Studio Retreat",
        price: 1800,
        priceLabel: "$1,800/mo",
        location: "Arts District",
        city: "Portland",
        type: "rent",
        category: "residential",
        bedrooms: 1,
        bathrooms: 1,
        area: 550,
        image: "/images/property-6.jpg",
        images: ["/images/property-6.jpg"],
        description:
            "A beautifully designed studio with natural wood finishes and abundant natural light. Perfect for creatives seeking a serene living space in the heart of the arts district.",
        amenities: ["Laundry", "Pet Friendly", "Bike Storage", "Garden Access"],
        agent: { name: "Tom Baker", phone: "+1 555-0106", email: "tom@estate.com" },
        featured: false,
        createdAt: "2026-02-18",
    },
];
