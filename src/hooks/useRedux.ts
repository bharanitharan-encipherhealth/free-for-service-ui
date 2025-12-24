"use client";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/state";

/**
 * Typed version of useDispatch hook
 * Use this instead of the plain useDispatch from react-redux
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector hook
 * Use this instead of the plain useSelector from react-redux
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

