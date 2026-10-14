import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  name: z.string().min(2, 'Full name must be at least 2 characters').max(60).trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required').trim(),
  password: z.string().min(1, 'Password is required'),
})

export const grantCreditsSchema = z.object({
  targetUserId: z.string().min(1, 'Target user is required'),
  amount: z
    .number()
    .positive('Credit amount must be greater than 0')
    .max(100000, 'Maximum 100,000 demo credits allowed per grant'),
  reason: z
    .string()
    .min(5, 'Mandatory audit reason must be at least 5 characters')
    .max(250, 'Audit reason cannot exceed 250 characters')
    .trim(),
})

export const toggleUserStatusSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  reason: z.string().min(3, 'Reason is required').trim(),
})

export const settleMarketSchema = z.object({
  marketId: z.string().min(1, 'Market ID is required'),
  winningOptionId: z.string().min(1, 'Winning option ID is required'),
  note: z.string().max(300).optional(),
})

export const betSelectionSchema = z.object({
  matchId: z.string().min(1),
  marketId: z.string().min(1),
  optionId: z.string().min(1),
  odds: z.number().positive(),
  matchTitle: z.string(),
  marketName: z.string(),
  selectionLabel: z.string(),
})

export const placeBetSchema = z.object({
  betType: z.enum(['SINGLE', 'ACCUMULATOR']),
  totalStake: z.number().positive('Stake must be greater than 0').max(50000, 'Maximum stake is 50,000 credits'),
  selections: z.array(betSelectionSchema).min(1, 'At least one selection is required'),
})

export const cashOutSchema = z.object({
  betId: z.string().min(1, 'Bet ID is required'),
})
