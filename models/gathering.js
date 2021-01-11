const db = require("../db");
const ExpressError = require("../helpers/expressError");

const { 
    create_new_master_gathering,
    create_gathering_merchants_by_gathering_id,
    create_gathering_images_by_gathering_id,
    fetch_gathering_by_gathering_id,
    fetch_gathering_merchants_by_gathering_id,
    fetch_gathering_images_by_gathering_id,
    fetch_gatherings_by_merchant_id,
    fetch_gathering_merchant_by_participant_id,
    fetch_gathering_image_by_image_id,
    update_gathering_by_gathering_id,
    delete_gathering_by_id,
    delete_gathering_merchant_by_participant_id,
    delete_gathering_image_by_image_id
} = require("../repositories/gathering.repository");
/** Gathering Management Class */

class Gathering {

    // ╔═══╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║╔═╗║║╔═╗║║╔══╝║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ╚╝║╚═╝║║╚══╗║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ╔╗║╔╗╔╝║╔══╝║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║║╚╗║╚══╗║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝╚═╝╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    /** Create gathering with data. Returns new gathering data. */

    static async add_gathering(merchant_id, data) {
        const gathering = await create_new_master_gathering(merchant_id, data);
        return gathering;
    }

    static async add_gathering_merchants(id, data) {
        if (!data.merchants || data.merchants.length === 0) {
            throw new ExpressError(`Unable to process request: No merchants selected to add to the gathering`, 400);
        }       

        const addedMerchants = await create_gathering_merchants_by_gathering_id(id, data.merchants);
        return addedMerchants;
    }

    static async add_gathering_images(id, data) {
        if (!data.images || data.images.length === 0) {
            throw new ExpressError(`Unable to process request: No images selected to add to the gathering`, 400);
        }
    
        const addedImages = await create_gathering_images_by_gathering_id(id, data.images);
        return addedImages;
    }


    // ╔═══╗╔═══╗╔═══╗╔═══╗
    // ║╔═╗║║╔══╝║╔═╗║╚╗╔╗║
    // ║╚═╝║║╚══╗║║ ║║ ║║║║
    // ║╔╗╔╝║╔══╝║╚═╝║ ║║║║
    // ║║║╚╗║╚══╗║╔═╗║╔╝╚╝║
    // ╚╝╚═╝╚═══╝╚╝ ╚╝╚═══╝  

    static async retrieve_single_gathering(id) {
        const gathering = await fetch_gathering_by_gathering_id(id);

        if (gathering) {
            return gathering;    
        }
        
        throw new ExpressError(`Unable to find target gathering`, 404);
    }

    static async retrieve_gathering_details(id) {
        const gathering = await fetch_gathering_by_gathering_id(id);

        if (gathering) {
            gathering.merchants = await fetch_gathering_merchants_by_gathering_id(id);
            gathering.images = await fetch_gathering_images_by_gathering_id(id);
            return gathering;
        }

        throw new ExpressError(`Unable to find target gathering`, 404);
    }

    static async retrieve_merchant_gatherings(merchant_id){
        const gatherings = await fetch_gatherings_by_merchant_id(merchant_id);
        return gatherings;
    }
    
    static async retrieve_gathering_participant(participant_id) {
        const participant = await fetch_gathering_merchant_by_participant_id(participant_id);

        console.log("Participant:", participant)

        if (participant) {
            return participant;
        }

        throw new ExpressError(`Unable to find target gathering participant`, 404);
    }

    static async retrieve_gathering_image(img_id) {
        const image = await fetch_gathering_image_by_image_id(img_id);

        if (image) {
            return image;
        }

        throw new ExpressError(`Unable to find target gathering image`, 404);
    }

    // ╔╗ ╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗
    // ║║ ║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝
    // ║║ ║║║╚═╝║ ║║║║║║ ║║╚╝║║╚╝║╚══╗
    // ║║ ║║║╔══╝ ║║║║║╚═╝║  ║║  ║╔══╝
    // ║╚═╝║║║   ╔╝╚╝║║╔═╗║ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚╝   ╚═══╝╚╝ ╚╝ ╚══╝ ╚═══╝

    static async modify_gathering(id, data) {   
        const gathering = await update_gathering_by_gathering_id(id, data);

        if (!gathering) {
            throw new ExpressError(`Unable to find update gathering`, 404);
        }
        return gathering;
    }

    // ╔═══╗╔═══╗╔╗   ╔═══╗╔════╗╔═══╗
    // ╚╗╔╗║║╔══╝║║   ║╔══╝║╔╗╔╗║║╔══╝
    //  ║║║║║╚══╗║║   ║╚══╗╚╝║║╚╝║╚══╗
    //  ║║║║║╔══╝║║ ╔╗║╔══╝  ║║  ║╔══╝
    // ╔╝╚╝║║╚══╗║╚═╝║║╚══╗ ╔╝╚╗ ║╚══╗
    // ╚═══╝╚═══╝╚═══╝╚═══╝ ╚══╝ ╚═══╝

    static async remove_gathering(id) {
        const deletedGathering = await delete_gathering_by_id(id);

        if (!deletedGathering) {
            throw new ExpressError(`Unable to find target gathering for deletion`, 404);
        }
        return deletedGathering;
    }

    static async remove_gathering_merchant(gatheringId, participantId) {
        const deletedMerchant = await delete_gathering_merchant_by_participant_id(gatheringId, participantId);
        
        if (!deletedMerchant) {
            throw new ExpressError(`Unable to find target gathering merchant for deletion`, 404);
        }
        return deletedMerchant;
    }

    static async remove_gathering_image(gatheringId, imageId) {      
        const deletedImage = await delete_gathering_image_by_image_id(gatheringId, imageId);

        if (!deletedImage) {
            throw new ExpressError(`Unable to find target gathering image for deletion`, 404);
        }
        return deletedImage;
    }
}

module.exports = Gathering;