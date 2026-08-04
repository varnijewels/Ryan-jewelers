import type { Component } from 'svelte'
import DefaultHomepage from './default/DefaultHomepage.svelte'
import SarabHomepage from './sarab/SarabHomepage.svelte'
import OrganicHomepage from './organic/OrganicHomepage.svelte'
import LimelightHomepage from './limelight/LimelightHomepage.svelte'
import NoorHomepage from './noor/NoorHomepage.svelte'
import BorisAndTwinsHomepage from './boris-and-twins/BorisAndTwinsHomepage.svelte'
import RyansJewelsHomepage from './ryans-jewels/RyansJewelsHomepage.svelte'

export const themeHomepages: Record<string, Component> = {
	default: DefaultHomepage,
	sarab: SarabHomepage,
	organic: OrganicHomepage,
	limelight: LimelightHomepage,
	noor: NoorHomepage,
	'boris-and-twins': BorisAndTwinsHomepage,
	'ryans-jewels': RyansJewelsHomepage
}
