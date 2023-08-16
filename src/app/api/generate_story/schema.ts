// The following is a schema definition for a kid story book.

export interface Story {
    pages: Page[];
}

// Use this type for story book page
export interface Page {
    type: 'page';
    pageNo: number;
    content: string;
}