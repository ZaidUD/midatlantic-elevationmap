# Mid-Atlantic CHM and Digital Elevation Models Dataset

This dataset provides high-resolution (1-meter per pixel) Canopy Height Models (CHMs) and Digital Elevation Models (DEMs) for the mid-Atlantic region of the United States. Utilizing advanced Deep Learning (DL) techniques and high-resolution multispectral imagery, these CHMs and DEMs offer a cost-effective, highly accurate alternative to traditional LiDAR surveys, surpassing the precision of existing DL-generated CHM datasets.
Developed through innovative PhD research at the University of Delaware, this dataset empowers researchers, policymakers, and professionals in ecology, forestry, urban planning, hydrology, and climate science. From advancing biodiversity conservation to enhancing disaster management, its applications are vast and impactful. Freely accessible, this dataset is designed to drive innovation and maximize its transformative potential across diverse fields.

## Impact

This dataset’s high resolution and open access enable transformative applications across multiple fields:
- **Ecology and Biodiversity**: Maps habitats for species like birds and mammals, monitors invasive species, and assesses ecosystem health in mid-Atlantic forests.
- **Forestry**: Estimates above-ground biomass for carbon accounting, monitors forest health, and supports sustainable timber management.
- **Urban Planning**: Guides urban forestry and green space planning in cities like Philadelphia and Baltimore, mitigating urban heat islands.
- **Hydrology**: Models flood risks and watershed dynamics in the Mid-Atlantic region, aiding water resource management.
- **Disaster Management**: Assesses wildfire risks and post-storm vegetation damage, enhancing resilience in coastal zones.
- **Climate Research**: Supports carbon sequestration studies and land use change analysis under climate scenarios.

**Stakeholders** include _University of Delaware departments_ (Geography and Spatial Sciences, Plant and Soil Sciences, Data Science Institute, College of Earth, Ocean and Environment), _government agencies_ (USGS, Delaware DNREC, Chesapeake Bay Program), _private sectors_ (environmental consulting, agrotech), and _global researchers_. Open access amplifies collaboration, enabling interdisciplinary research and policy decisions.

## Dataset Description

- **Spatial Coverage**: Mid-Atlantic U.S., including Delaware, Maryland, New Jersey, and Virginia (Bounding Box: 36.5636, -83.7165, 41.4006, -73.8454).
- **Resolution**: 1 meter per pixel.
- **Format**: GeoTIFF (raster).
- **Units**: Height in meters.
- **Temporal Scope**: Derived from multispectral imagery captured in 2023.
- **Size**: Approximately 468 GB (compressed).

## Access

- **Project Website**: [https://zaidud.github.io/midatlantic-elevationmap/](https://zaidud.github.io/midatlantic-elevationmap/)

The [website](https://zaidud.github.io/midatlantic-elevationmap/) provides interactive maps for visualization of the dataset and easy download of subregions.
- **Dataset Directory**: [https://www.eecis.udel.edu/~arce/mida-elevation/](https://www.eecis.udel.edu/~arce/mida-elevation/)

The dataset directory is organized by state for efficient access.

- **Zenodo**: Available at [Insert Zenodo DOI or placeholder link, e.g., https://zenodo.org/record/XXXXXXX].

### Tools

- **Python Scripts**: Sample scripts for loading and analyzing the dataset are available at [Insert GitHub link or repository].

## Generation Process

### Methodology

The CHM and DEM are generated using a deep generative learning model designed for image translation pretrained on depth estimation. The model was trained to estimate vegetation height from 1m-resolution multispectral imagery, leveraging image-translation and depth estimation techniques to generate a realistic elevation model.

During Training the model used the [High-resolution orthorectified camera imagery mosaic](https://data.neonscience.org/data-products/DP3.30010.001) (multispectral) and the [Ecosystem structure](https://data.neonscience.org/data-products/DP3.30015.001) (CHM) from the [NEON project](https://data.neonscience.org/) by NSF. NEON's multispectral imagery and CHMs are collected from an airborne platform.
The model was tasked to use the multispectral bands as input and generate the corresponding CHM.

During inference the model used high-resolution (1m) Multispectral imagery from the National Agriculture Imagery Program (NAIP), collected during leaf-on conditions in 2023. NAIP imagery provides red, green, blue, and near infrared bands, capturing detailed vegetation patterns across the Mid-Atlantic.

Limitations include reduced accuracy in urban areas with sparse vegetation or under cloud-covered RGB inputs or out-of-distribution camera settings for the multispectral imagery.

### Output (Characteristics of Files and CHM)

- **File Format**: GeoTIFF, georeferenced to EPSG:32618 (UTM Zone 18N).
- **Structure**: Tiled rasters by state for manageable processing (e.g., `DE_CHM_1m.tif`, `MD_CHM_1m.tif`).
- **CHM Characteristics**: Pixel values represent vegetation height in meters relative to ground elevation, ranging from 0 (ground or low vegetation) to [max height, e.g., 40m] for tall trees. Each tile includes metadata on spatial extent and projection.
- **Quality**: High accuracy (e.g., R² = [Insert value, e.g., 0.9] against LiDAR), with minor errors in dense urban or cloudy areas.

## License

This dataset is licensed under **Creative Commons CC BY 4.0**, allowing free use with attribution. Please cite as:  
[Kevin R.]. (2025). Mid-Atlantic CHM and Digital Elevation Models Dataset. University of Delaware. [10.5281/zenodo.17253085](10.5281/zenodo.17253085
).

## Acknowledgements

 - NEON (National Ecological Observatory Network). Ecosystem structure (DP3.30015.001), RELEASE-2025. https://doi.org/10.48443/jqqd-1n30. Dataset accessed from https://data.neonscience.org/data-products/DP3.30015.001/RELEASE-2025 on October 3, 2025.
 - 
