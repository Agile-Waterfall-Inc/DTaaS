import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

export default async function auth( req: NextApiRequest, res: NextApiResponse ): Promise<any> {
  return await NextAuth( req, res, {
    providers: [
      {
        id: 'flooq',
        name: 'Flooq',
        type: 'oauth',
        wellKnown: 'https://localhost:5001/.well-known/openid-configuration',
        authorization: { params: { scope: 'openid profile flooqapi' } },
        idToken: true,
        checks: ['pkce', 'state'],
        clientId: process.env.IDENTITY_SERVER_CLIENT_ID,
        clientSecret: process.env.IDENTITY_SERVER_CLIENT_SECRET,
        profile( profile ): any {
          console.log( 'GET PROFILE', profile )
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          }
        },
      }
    ],
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
      async jwt( params ): Promise<JWT> {
        console.log( 'JWT', params )
        return params.token
      }
    }
  } )
}