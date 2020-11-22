<template>

<div class="rel">
	<!-- add some kind of higher box so loader loads before the module loading gets shown -->
	<!-- <v-lazy>
	<v-progress-circular v-if="!isActive" indeterminate size="64" />
	</v-lazy> -->
	<v-lazy
		transition="fade-transition"
		v-model="isActive"
	>
		<div v-if="isActive">
			<module-overlay
				v-bind:overlayState="overlay"
				v-on:click="overlay = $event"
			/>
			<v-card class="mx-auto" :style="cssVars" :class="cardType" :ripple="false">
				<header class="pkg-header" :class="typeClass">
					<v-card-title><a :href="'/package/'+module.name">{{ module.title }}</a></v-card-title>
					<v-card-subtitle>
						<span class="pkg-type">{{module.type}}</span>
						-
						<span class="pkg-ver">v{{ module.latest }}</span>
						<!--span class="popularity">
							<progress-ring :radius="25" :progress="installs" :stroke="3"/>
							<label>Users</label>
							<span>{{ popularity }}%</span>
						</span-->
					</v-card-subtitle>
				</header>
				<main>
					<v-card-text style="padding-top: 10px;">
						<h4 class="author">
							<label>{{authorLabel}}</label>
							<span>{{ module.authors.join(", ") }}</span>
						</h4>
						<p class="desc" v-html="module.description"></p>
					</v-card-text>
					<!--v-card-text class="languages">
						<v-chip class="languageChip" v-for="language in languages" :key="language">
							<v-icon size="1.5em" left>mdi-translate</v-icon>
							{{ language }}
						</v-chip>
					</v-card-text-->
				</main>
			</v-card>
		</div>
	</v-lazy>
</div>

</template>

<script>
import axios from "axios";
//import ProgressRing from "./ProgressRing.vue";
//import ResizeSensor from "vue-resize-sensor";
import ModuleOverlay from "./ModuleOverlay.vue";

export default {
	name: "Module",
	components: {
	//	ProgressRing,
	//	ResizeSensor,
		ModuleOverlay
	},
	props: {
		modules: Array,
		module: Object
	},

	data: () => ({
		isActive: false,
		show: false,
		loader: null,
		loading: false,
		manifest: {
			minimumCoreVersion: "?.?.?",
			compatibleCoreVersion: "?.?.?",
			dependencies: []
		},
		manifestLoaded: false,
		hasDependencies: false,
		footerHeight: 0,
		overlay: false,
	}),

	watch: {
		loader () {
			const l = this.loader
			this[l] = !this[l]

			setTimeout(() => (this[l] = false), 3000)

			this.loader = null
		}
	},

	computed: {
		foundryPackageUrl() {
				return `https://foundryvtt.com/packages/${this.module.name}/`;
		},
		typeClass() {
			return {
				"module": "typ-module",
				"system": "typ-system",
				"world": "typ-world"
			}[this.module.type] || "typ-none";
		},
		languages() {
			let languages = [];
			this.module.languages.forEach(language => {
				let languageTag = this.$func.getLanguageByTag(language);
				if (!languages.includes(languageTag)) {
					languages.push(languageTag);
				}
			})
			return languages;
		},
		hasLanguages() {
			if (this.module.languages && this.module.languages.length !== 0) {
				return true;
			}
			return false;
		},
		installs() {
			return Number(this.module.installs);
		},
		popularity() {
			const inst = Number(this.module.installs);
			let pop = inst > 1 ? Math.round(inst) : "<1";
			return pop;
		},
		coverImage() {
			const media = this.module.media;
			if (!media) return "";
			const image = 
				media.find(m => m.type == "cover") ||
				media.find(m => m.type == "icon");
			return image?.url ?? "";
		},
		cssVars() {
			return {
				'--footer-height': this.footerHeight + 'px',
				'--cover-image': `url('${this.coverImage}')`
			}
		},
		cardType() {
			return this.coverImage ? "image-card" : "text-card";
		},
		authorLabel() {
			return `Author${this.module.authors.length > 1 ? 's' : ''}: `;
		}
	},
	methods: {

		getManifest() {
			if (this.manifestLoaded) return;
			this.manifestLoaded = true;
			axios
				.get(
					// TODO: Do not make forge api hardcoded but use api setting
					"https://forge-vtt.com/api/bazaar/manifest/" +
					this.module.name
				)
				.then(response => {
					this.manifest = response.data;
					if (response.data?.dependencies && response.data.dependencies?.length !== 0) this.hasDependencies = true;
				})
				.catch(() => {
					axios
						.get(
							"https://cors-anywhere.herokuapp.com/" +
							this.module.manifest
						)
						.then(response => {
							this.manifest = response.data;
							if (response.data?.dependencies && response.data.dependencies?.length !== 0) this.hasDependencies = true;
						})
				})
		},

		footerResizeHandler(size) {
			this.footerHeight = size.height;
		}

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$radius: 10px;
$trans-dur: .5s;

.rel {
	position: relative;
	height: 18em;

	.v-card {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		max-width: 55ch;
		height: 18em;
		transition: .2s box-shadow;
		background-color: var(--accent-color);
		border-radius: $radius;
		transition: $trans-dur box-shadow;
		box-shadow: var(--card-shadows);

		.v-btn {
			color: #999;
		}

		.typ-module {
			--color: #774d00;
		}
		.typ-system {
			--color: #338
		}
		.typ-world {
			--color: #151
		}
		.typ-none {
			--color: #BBB;
		}
		&.text-card {
			header.pkg-header {
				height: 4.5em;

				.v-card {
					&__title {
						margin-top: 1em;
					}
				}
			}
			main {
				height: 12.5em;
			}
		}
		&.image-card {
			header.pkg-header {
				height: 12em;
				background-image: var(--cover-image);
				background-size: cover;
				background-position: center;

				.v-card {
					&__title {
						position: relative;
						z-index: 2;
						margin-top: 7.75em;
					}
					&__subtitle {
						position: relative;
						z-index: 2;
					}
				}
				&::after {
					display: block;
					content: ' ';
					position: absolute;
					bottom: 0px;
					background: linear-gradient(to top, #00000080, transparent);
					width: 100%;
					height: 6em;
					z-index: 1;
				}
			}
			main {
				height: 5em;
			}
		}
		header.pkg-header {
			position: relative;
			background-color: var(--primary-color);
			
			.v-card {
				&__title {
					font-size: 1.1em;
					margin-top: 0;
					line-height: 1em;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					/*width: calc(100% - 70px);*/
					display: inline-block;
					color: var(--light-text-color);
					text-shadow: 0 0 3px #2b2b2b;
					padding: 0px;
					padding-left: 2px;
					padding-right: 2px;
					margin: 16px;

					a {
						color: inherit;
						text-decoration: inherit;
						&:hover {
							text-decoration: underline dotted;
						}
					}
				}
				&__subtitle {
					line-height: 1em;
					text-shadow: 0 0 3px #2b2b2b;
					color: var(--light-text-color-secondary);
					margin: 0 {
						top: -1.3em;
					}
				}
			}

			.pkg-type {
				margin-left: -2px;
				display: inline-block;
				padding: 6px;
				background-color: var(--color);
				border-radius: $radius;
			}

		/*	.popularity {
				position: absolute;
				right: 40px;
				bottom: .5em;
				display: inline-block;
				width: 44px;
				text-align: center;
				height: 44px;
				background-color: var(--secondary-color);
				border-radius: 50%;
				svg {
					position: absolute;
					top: -3.5px;
					left: -3.5px;
				}
				label {
					font-size: .8em;
					color: var(--accent-color-light);
					line-height: 1em;
					position: absolute;
					top: -1.2em;
					left: 0;
					width: 100%;
				}
				span {
					font-size: .9em;
					line-height: 1em;
					position: absolute;
					top: 1.2em;
					width: 100%;
					left: 0;
				}
			}*/
		}

		main {
			line-height: 1.5em;
			overflow-y: hidden;

			.v-card__text {
				height: 100%;
			}
			.desc {
				overflow-y: hidden;
				height: 100%;
				position: relative;
			}
			.author {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: var(--accent-color-light);
				border-bottom: 1px dashed var(--accent-color-light);
				margin-bottom: .5em;

				label {
					color: var(--accent-color-light);
				}
			}
			&::after {
				content: " ";
				position: absolute;
				bottom: 1em;
				right: 0;
				width: 100%;
				height: 2em;
				background-image: linear-gradient(to bottom, transparent, var(--accent-color));
			}
		}
		&:hover {
			box-shadow: 0 3px 10px 2px #000000a6;
		}
	}
}
</style>
