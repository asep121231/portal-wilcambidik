export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    created_at?: string
                }
                Relationships: []
            }
            posts: {
                Row: {
                    id: string
                    title: string
                    content: string
                    category_id: string | null
                    status: 'draft' | 'published'
                    urgency: 'urgent' | 'normal'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    category_id?: string | null
                    status?: 'draft' | 'published'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    category_id?: string | null
                    status?: 'draft' | 'published'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'posts_category_id_fkey'
                        columns: ['category_id']
                        isOneToOne: false
                        referencedRelation: 'categories'
                        referencedColumns: ['id']
                    }
                ]
            }
            attachments: {
                Row: {
                    id: string
                    post_id: string
                    file_url: string
                    file_type: string
                    file_name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    file_url: string
                    file_type: string
                    file_name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    file_url?: string
                    file_type?: string
                    file_name?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'attachments_post_id_fkey'
                        columns: ['post_id']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types
export type Category = Database['public']['Tables']['categories']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Attachment = Database['public']['Tables']['attachments']['Row']

export type PostWithCategory = Post & {
    categories: Category | null
}

export type PostWithAttachments = Post & {
    attachments: Attachment[]
}

export type PostDetail = Post & {
    categories: Category | null
    attachments: Attachment[]
}
