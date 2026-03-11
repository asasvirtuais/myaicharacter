'use server'

import { firestoreInterface } from 'asasvirtuais-firebase/interface'
import { auth0 } from '@/lib/auth0'

const baseInterface = firestoreInterface()

// Utility to strip undefined values and ensure plain objects for Firestore
function clean(obj: any): any {
    if (Array.isArray(obj)) return obj.map(clean)
    if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, clean(v)])
        )
    }
    return obj
}

export const find = async (props: any) => {
    return baseInterface.find(props)
}

export const list = async (props: any) => {
    return baseInterface.list(props)
}

export const create = async (props: any) => {
    const session = await auth0.getSession()
    if (!session?.user) {
        throw new Error('Unauthorized: You must be signed in.')
    }

    const data = clean({ ...props.data })

    if (props.table === 'characters') {
        data.author = session.user.id
        data.owner = null
    } else if (props.table === 'records') {
        data.author = session.user.id
        data.datetime = new Date().toISOString()
        data.approved = true
    }

    return baseInterface.create({ ...props, data })
}

export const update = async (props: any) => {
    const session = await auth0.getSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const data = clean({ ...props.data })

    if (props.table === 'characters') {
        const existing = await baseInterface.find({ table: 'characters', id: props.id })
        
        const isClaiming = !existing.owner && data.owner === session.user.id
        const isAllowedModifier = existing.owner === session.user.id || existing.author === session.user.id

        if (!isClaiming && !isAllowedModifier) {
            throw new Error('Forbidden: You do not have permission to modify this character.')
        }

        // Safety check
        if (data.owner && data.owner !== session.user.id && existing.owner !== session.user.id) {
            throw new Error('Forbidden: You cannot assign ownership to another user.')
        }
    }

    return baseInterface.update({ ...props, data })
}

export const remove = async (props: any) => {
    const session = await auth0.getSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    if (props.table === 'characters') {
        const existing = await baseInterface.find({ table: 'characters', id: props.id })
        if (existing.owner !== session.user.id && existing.author !== session.user.id) {
            throw new Error('Forbidden: You do not have permission to delete this character.')
        }
    }

    return baseInterface.remove(props)
}

